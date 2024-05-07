package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataTypeHandlerService {

    private final DataTransferService dataTransferService;
    private final OutputHandlerService outputHandlerService;

    public void handle(MessageDto messageDto){

        DataType dataType = messageDto.getDataType();
        switch (dataType){
            case SIGNAL:
                System.out.println(dataType);
                System.out.println(messageDto.getContent());
                break;

            case OUTPUT:
                System.out.println(dataType);
                System.out.println(messageDto.getContent());
                outputHandlerService.process(messageDto);
                break;

            case ERROR:
                System.out.println(dataType);
                System.out.println(messageDto.getContent());
                break;

            case SCM:
                System.out.println(dataType);
                System.out.println(messageDto.getContent());
                break;

            default:
                System.out.println(dataType);
                break;
        }

        // main으로 데이터 전송 로직 추가
    }

    private void processSignal(MessageDto messageDto){
        System.out.println(messageDto.toString());
    }

    private void processOutput(MessageDto messageDto) {
        dataTransferService.transferDataForSave(messageDto);
    }

    private void processError(MessageDto messageDto){
        dataTransferService.transferDataForSave(messageDto);
    }

    private void processSCM(MessageDto messageDto) {
        System.out.println(messageDto.toString());
    }

}
