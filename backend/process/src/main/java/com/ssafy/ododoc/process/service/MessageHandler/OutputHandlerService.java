package com.ssafy.ododoc.process.service.MessageHandler;

import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.entity.CurrentStatus;
import com.ssafy.ododoc.process.entity.MessageRecord;
import com.ssafy.ododoc.process.repository.CurrentStatusRepository;
import com.ssafy.ododoc.process.repository.MessageRecordRepository;
import com.ssafy.ododoc.process.type.SourceApplicationType;
import com.ssafy.ododoc.process.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OutputHandlerService {
    private MessageDto messageData;
    private StatusType currentStatus;
    private final GptService gptService;
    private final MessageRecordRepository messageRecordRepository;
    private final CurrentStatusRepository currentStatusRepository;
    private CurrentStatus nextStatus;
    private GptResponseDto chat;
    private String prompt;

    public MessageDto handle(MessageDto messageDataInput) {
        System.out.println("!output process start!");
        messageData = messageDataInput;
        messageRecordRepository.save(new MessageRecord(messageData));

        Long connectedFileId = messageData.getConnectedFileId();
        SourceApplicationType sourceApplication = messageData.getSourceApplication();

        // 쿼리 메서드 사용
        CurrentStatus status = currentStatusRepository.findFirstByConnectedFileIdAndSourceApplicationOrderByTimestamp(
                connectedFileId, sourceApplication);

        currentStatus = (status != null) ? status.getStatus() : null;

        if (currentStatus == null) {
            processInit();
            System.out.println("!output process end!");
            return messageData;
        }
        switch (currentStatus) {
            case WAITING:
                processInit();
                break;
            case PREPARING:
                processPreparing();
                break;
            case RUNNING:
                processRunning();
                break;
            case ERROR:
                processError();
                break;
            case ALGORITHM:
                processAlgorithm();
                break;
            case SEARCHING:
                processSearching();
                break;
        }
        System.out.println("!output process end!");
        return messageData;
    }

    /**
     * GPT-3.5-turbo를 이용한 요약 처리
     */
    private void gptProcess() {
        System.out.println("===================process 1===================");
//        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", messageData.getContent().toString() + "\n이거 요약해줘 ", "http://localhost:8080/api");
//        System.out.println(chat.getChoices().get(0).getMessage().getContent());
        System.out.println("===============================================");
    }

    private void processInit() {
        System.out.println("processing Init");
        prompt = messageData.getContent().toString() + "\n이게 터미널 출력인데, 이게 지금 서버를 여는 상황이면 PREPARING, 알고리즘을 푸는 상황인 것 같으면 ALGORITHM을 반환해줘 [PREPARING, ALGORITHM] 둘 중에 하나로 단답형으로 ";
        chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");
        nextStatus = CurrentStatus.builder()
                .connectedFileId(messageData.getConnectedFileId())
                .sourceApplication(messageData.getSourceApplication())
                .timestamp(messageData.getTimestamp())
                .status(StatusType.valueOf(chat.getChoices().get(0).getMessage().getContent()))
                .build();
        currentStatusRepository.save(nextStatus);
        System.out.println(nextStatus.getStatus());

        if (nextStatus.getStatus() == StatusType.ALGORITHM) {
            processAlgorithm();
        }
    }

    private void processPreparing() {
        System.out.println("processing Preparing");
        prompt = messageData.getContent().toString() + "\n이게 터미널 출력이고 서버를 여는 상황이야, 이게 지금 서버를 아직도 여는 상황이면 PREPARING, 알고리즘을 푸는 상황인 것 같으면 ALGORITHM을 반환해줘 [PREPARING, ALGORITHM] 둘 중에 하나로 단답형으로 ";
        chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

    }

    private void processRunning() {
        System.out.println("processing Running");
    }

    private void processError() {
        System.out.println("processing Error");
    }

    private void processAlgorithm() {
        System.out.println("processing Algorithm");
        nextStatus = CurrentStatus.builder()
                .connectedFileId(messageData.getConnectedFileId())
                .sourceApplication(messageData.getSourceApplication())
                .timestamp(messageData.getTimestamp())
                .status(StatusType.WAITING)
                .build();
    }

    private void processSearching() {
        System.out.println("processing Searching");
    }

}
