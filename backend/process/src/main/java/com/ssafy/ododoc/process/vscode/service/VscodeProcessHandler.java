package com.ssafy.ododoc.process.vscode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.common.dto.SocketSendMessageDto;
import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.entity.CurrentStatus;
import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.repository.CurrentStatusRepository;
import com.ssafy.ododoc.process.common.service.SendBlockService;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Component
@RequiredArgsConstructor
public class VscodeProcessHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GptService gptService;
    private final CurrentStatusRepository currentStatusRepository;
    private final SendBlockService sendBlockService;
    private final VscodeDataTransferService vscodeDataTransferService;
    private String classificationResult;
    private IDEContentDto ideContentDto;
    private SocketSendMessageDto socketSendMessageDto;
    private String summary;

    public void handle(StatusType status, DataType dataType, MessageRecord messageRecord, WebSocketSession webSocketSession) {
        System.out.println("when: " + status);
        System.out.println("what: " + dataType);
        switch (status) {
            case WAITING:
                handleWaiting(dataType, messageRecord, webSocketSession);
                break;
            case RUNNING:
                handleRunning(dataType, messageRecord, webSocketSession);
                break;
            case TROUBLED:
                handleTroubled(dataType, messageRecord, webSocketSession);
                break;
            case ALGORITHM:
                handleAlgorithm(dataType, messageRecord, webSocketSession);
                break;
        }
    }

    private void handleWaiting(DataType dataType, MessageRecord messageRecord, WebSocketSession webSocketSession) {
        try {

            switch (dataType) {
                case SIGNAL:
                    System.out.println(messageRecord.getContent());
                    break;
                case OUTPUT:
                    System.out.println(messageRecord.getContent());
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    classificationResult = classificationByGpt(List.of("서버실행", "알고리즘출력"), ideContentDto.getDetails());
                    // 일반 출력 => 알고리즘으로 변경
                    // else => status = running 변경
                    if (classificationResult.equals("서버실행")) {
                        currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.RUNNING));
                    } else {
                        handleAlgorithm(dataType, messageRecord, webSocketSession);
                    }
                    break;
                case ERROR:
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.TROUBLED));
                    // status = troubled 변경 & 메인서버 전송
                    System.out.println(messageRecord.getContent());

                    sendBlockService.sendRequest(vscodeDataTransferService.makeTroubleBlocks(messageRecord), messageRecord);
                    summary = summarizeByGpt(ideContentDto.getDetails());
                    sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);

                    socketSendMessageDto = new SocketSendMessageDto("SOURCECODE");
                    webSocketSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(socketSendMessageDto)));

                    break;
                case SOURCECODE:
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    summary = summarizeByGpt(objectMapper.writeValueAsString(ideContentDto.getModifiedFiles()));

                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));


                    sendBlockService.sendRequest(vscodeDataTransferService.makeChangedCodeBlocks(messageRecord), messageRecord);
                    sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);
                    break;
                case KEYWORD:
                case SEARCH:
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleRunning(DataType dataType, MessageRecord messageRecord, WebSocketSession webSocketSession) {
        try {
            switch (dataType) {
                    case SIGNAL:
                        System.out.println(messageRecord.getContent());
                        break;
                    case OUTPUT:
                        // 일반 출력 => 무시
                        // 서버 종료 => status = waiting
                        // 런타임 에러 => status = troubled, status = running & 메인서버 전송
                        ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                        classificationResult = classificationByGpt(List.of("종료", "런타임에러", "알고리즘출력"), ideContentDto.getDetails());
                        if (classificationResult.equals("종료")) {
                            currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));
                        } else if (classificationResult.equals("런타임에러")) {
                            currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.TROUBLED));
                            sendBlockService.sendRequest(vscodeDataTransferService.makeTroubleBlocks(messageRecord), messageRecord);

                            summary = summarizeByGpt(ideContentDto.getDetails());
                            sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);
                        } else {
                            handleAlgorithm(dataType, messageRecord, webSocketSession);
                        }


                        break;
                    case ERROR:
                        // status = troubled 변경 & 메인서버 전송
                        currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.TROUBLED));
                        sendBlockService.sendRequest(vscodeDataTransferService.makeTroubleBlocks(messageRecord), messageRecord);

                        break;
                    case SOURCECODE:
                        ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                        summary = summarizeByGpt(objectMapper.writeValueAsString(ideContentDto.getModifiedFiles()));
                        currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));

                        sendBlockService.sendRequest(vscodeDataTransferService.makeChangedCodeBlocks(messageRecord), messageRecord);
                        sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);
                        break;

                    case KEYWORD:
                    case SEARCH:
                        break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void handleTroubled(DataType dataType, MessageRecord messageRecord, WebSocketSession webSocketSession) {
        try {
            switch (dataType) {
                case SIGNAL:
                    System.out.println(messageRecord.getContent());
                    break;
                case OUTPUT:
                    // 일반 출력 => 무시
                    // 서버 실행 => status = running
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    classificationResult = classificationByGpt(List.of("서버실행", "알고리즘출력"), ideContentDto.getDetails());
                    System.out.println(classificationResult);
                    if (classificationResult.equals("서버실행")) {
                        currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.RUNNING));
                    } else {
                        handleAlgorithm(dataType, messageRecord, webSocketSession);
                        // do nothing
                    }

                    break;
                case ERROR:
                    // status = troubled 유지

                    break;
                case SOURCECODE:
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    summary = summarizeByGpt(objectMapper.writeValueAsString(ideContentDto.getModifiedFiles()));
                    summary = summarizeByGpt(ideContentDto.getModifiedFiles().toString());
                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));

                    sendBlockService.sendRequest(vscodeDataTransferService.makeChangedCodeBlocks(messageRecord), messageRecord);
                    sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);
                    break;

                case KEYWORD:
                case SEARCH:
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleAlgorithm(DataType dataType, MessageRecord messageRecord, WebSocketSession webSocketSession) {
        try {
            switch (dataType) {
                case SIGNAL:
                    System.out.println(messageRecord.getContent());
                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));
                    break;
                case OUTPUT:
                    socketSendMessageDto = new SocketSendMessageDto("SOURCECODE");

                    webSocketSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(socketSendMessageDto)));
                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));

                    break;
                case ERROR:
                    System.out.println();
                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));

                    break;
                case SOURCECODE:
                    System.out.println(ideContentDto.getModifiedFiles().toString());
                    ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

                    summary = summarizeByGpt(objectMapper.writeValueAsString(ideContentDto.getModifiedFiles()));
                    currentStatusRepository.save(new CurrentStatus(messageRecord, StatusType.WAITING));

                    sendBlockService.sendRequest(vscodeDataTransferService.makeChangedCodeBlocks(messageRecord), messageRecord);
                    sendBlockService.sendRequest(vscodeDataTransferService.makeSummaryBlocks(summary), messageRecord);
                    break;
                case KEYWORD:
                case SEARCH:
                    break;

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String classificationByGpt(List<String> list, String content) {
        String listString = "\n" + String.join(", ", list);
        String prompt = content + "\n이게 터미널 출력인데, 이게 지금 어떤 상황에 가장 가까운 지 다음 리스트 중에 골라줘. 다른 말은 하지 말고, 한 단어만 골라서 대답해 주세요. " + listString;

        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }

    private String summarizeByGpt(String content) {
        String prompt = content + "\n이거 한 문장으로 요약해줘.";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }
}
