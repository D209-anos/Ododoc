package com.ssafy.ododoc.process.intelliJ.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.entity.CurrentStatus;
import com.ssafy.ododoc.process.common.repository.CurrentStatusRepository;
import com.ssafy.ododoc.process.common.service.DataTransferService;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataTypeHandlerServiceForIntelliJ {

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

        String prompt = ideContentDto.getDetails() + "\n이게 터미널 출력인데, 이게 지금 서버와 관련된 상황이면 SERVER, 알고리즘을 푸는 상황인 것 같으면 ALGORITHM을 반환해줘 [SERVER, ALGORITHM] 둘 중에 하나로 단답형으로 ";
        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", prompt, "");

        String result = chat.getChoices().get(0).getMessage().getContent();

        if(result.equals("SERVER")){
            ideContentDto.setDetails(null);
        }
    }

    private void processError(MessageDto messageDto){
        dataTransferService.makeFileBlock(messageDto);
    }

}
