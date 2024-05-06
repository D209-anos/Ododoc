package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataTypeHandlerService {

    private final DataTransferService dataTransferService;

    public void handle(MessageDto messageDto){

        switch (messageDto.getDataType()) {
            case SIGNAL:
                processSignal(messageDto);
                break;

            case OUTPUT:
                processOutput(messageDto);
                break;

            case ERROR:
                processError(messageDto);
                break;

            case SCM:
                processSCM(messageDto);
                break;

            default:
                System.out.println("알 수 없는 데이터 타입");
                break;
        }
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
