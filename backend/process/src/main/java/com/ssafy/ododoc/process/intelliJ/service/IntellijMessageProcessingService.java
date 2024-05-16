package com.ssafy.ododoc.process.intelliJ.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.service.DataTransferService;
import com.ssafy.ododoc.process.common.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IntellijMessageProcessingService {

    private final DataTransferService dataTransferService;
    private final ObjectMapper objectMapper;
    private final GptService gptService;

    public void handle(MessageDto messageDto) {
        DataType dataType = messageDto.getDataType();

        switch (dataType){
            case SIGNAL -> processSTART(messageDto);
            case OUTPUT -> processOutPut(messageDto);
            case ERROR -> processError(messageDto);
        }
    }

    private void processSTART(MessageDto messageDto){ }
    private void processOutPut(MessageDto messageDto){
        IDEContentDto ideContentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        String result = classificationByGpt(List.of("SERVER", "ALGORITHM"), ideContentDto.getDetails());

        if(result.equals("SERVER")){
            ideContentDto.setDetails(null);
        }
    }

    private void processError(MessageDto messageDto){
        dataTransferService.makeFileBlock(messageDto);
    }

    private String classificationByGpt(List<String> list, String content) {
        String listString = String.join("\n", list);
        String prompt = content + "\n이게 터미널 출력인데, 이게 지금 어떤 상황에 가장 가까운 지 다음 리스트 중에 골라줘. 다른 말 말고 딱 고르기만 해줘. " + listString;
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }

    private String summarizeByGpt(String content) {
        String prompt = content + "\n이거 한 문장으로 요약해줘.";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }
}
