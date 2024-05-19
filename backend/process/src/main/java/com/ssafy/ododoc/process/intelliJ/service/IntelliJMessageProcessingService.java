package com.ssafy.ododoc.process.intelliJ.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.common.dto.receive.ErrorFileDto;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.GPTSummarizeDto;
import com.ssafy.ododoc.process.common.service.SendBlockService;
import com.ssafy.ododoc.process.common.type.DataType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IntelliJMessageProcessingService {

    private final IntelliJDataTransferService dataTransferService;
    private final ObjectMapper objectMapper;
    private final GptService gptService;
    private final SendBlockService sendBlockService;

    public void handle(MessageDto messageDto) {
        DataType dataType = messageDto.getDataType();

        switch (dataType){
            case SIGNAL -> processSTART(messageDto);
            case OUTPUT -> processOutPut(messageDto);
            case ERROR -> processError(messageDto);
        }
    }

    private void processSTART(MessageDto messageDto){}
    private void processOutPut(MessageDto messageDto){
        GPTSummarizeDto gptSummarizeDto = new GPTSummarizeDto();
        IDEContentDto ideContentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        try {
            log.info("processOutput 호출 : {}", objectMapper.writeValueAsString(ideContentDto));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        String result = classificationByGpt(List.of("SERVER", "ALGORITHM"), ideContentDto.getDetails());
        if(result.equals("SERVER")){
            ideContentDto.setDetails(null);
            messageDto.setContent(ideContentDto);
        }

        if(!ideContentDto.getModifiedFiles().isEmpty()){
            List<ModifiedFileDto> modifiedFileList = ideContentDto.getModifiedFiles();
            gptSummarizeDto.setModifyFileSummarize(new ArrayList<>());
            for(ModifiedFileDto file : modifiedFileList){
                String summarizeContent = summarizeByGpt(file.getSourceCode());
                gptSummarizeDto.getModifyFileSummarize().add(summarizeContent);
            }
        }

        sendBlockService.sendRequest(dataTransferService.makeFileBlock(messageDto, gptSummarizeDto), messageDto);
    }

    private void processError(MessageDto messageDto){
        GPTSummarizeDto gptSummarizeDto = new GPTSummarizeDto();
        IDEContentDto ideContentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        try {
            log.info("processError 호출 : {}", objectMapper.writeValueAsString(ideContentDto));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        if(!ideContentDto.getModifiedFiles().isEmpty()){
            List<ModifiedFileDto> modifiedFileList = ideContentDto.getModifiedFiles();
            gptSummarizeDto.setModifyFileSummarize(new ArrayList<>());
            for(ModifiedFileDto file : modifiedFileList){
                String summarizeContent = summarizeByGpt(file.getSourceCode());
                gptSummarizeDto.getModifyFileSummarize().add(summarizeContent);
            }
        }

        if(ideContentDto.getErrorFile() != null){
            ErrorFileDto errorFileDto = ideContentDto.getErrorFile();
            String summarizeContent = summarizeByGptForError(errorFileDto.getSourceCode());
            gptSummarizeDto.setErrorFileLogSummarize(summarizeContent);
        }

        if(ideContentDto.getDetails() != null && !ideContentDto.getDetails().isBlank()){
            String summarizeContent = summarizeByGptForTerminal(ideContentDto.getDetails());
            gptSummarizeDto.setTerminalLogSummarize(summarizeContent);
        }

        sendBlockService.sendRequest(dataTransferService.makeFileBlock(messageDto, gptSummarizeDto), messageDto);
    }

    private String classificationByGpt(List<String> list, String content) {
        String listString = String.join("\n", list);
        String prompt = content + "\n이게 터미널 출력인데, 이게 지금 어떤 상황에 가장 가까운 지 다음 리스트 중에 골라줘. 다른 말 말고 딱 고르기만 해줘. " + listString;
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }

    private String summarizeByGpt(String content) {
        String prompt = content + "\n이거 한 문장으로 한국어로 요약해줘.";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }

    private String summarizeByGptForError(String content) {
        String prompt = content + "\n이거 에러가 난 코드인데 왜 에러가 났는지 한 문장으로 한국어로 요약해줘.";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }

    private String summarizeByGptForTerminal(String content) {
        String prompt = content + "\n이거 에러가 터미널 로그인데 왜 에러가 났는지 핵심 내용만 한 문장으로 한국어로 요약해줘.";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }
}
