package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.service.MessageHandler.OutputHandlerService;
import com.ssafy.ododoc.process.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataTypeHandlerService {

    private final DataTransferService dataTransferService;
    private final OutputHandlerService outputHandlerService;

    public void handle(MessageDto MessageDto){

        DataType dataType = MessageDto.getDataType();
        System.out.println(dataType);
        System.out.println(MessageDto.getContent());
        switch (dataType){
            case SIGNAL:
                processSignal(MessageDto);
                break;

            case OUTPUT:
                processOutput(MessageDto);
                break;

            case ERROR:
                processError(MessageDto);
                break;

            case SOURCECODE:
                processSourcecode(MessageDto);
                break;

            default:
                break;
        }

        // main으로 데이터 전송 로직 추가
    }

    private void processSignal(MessageDto MessageDto){
        System.out.println(MessageDto.toString());
    }

    private void processOutput(MessageDto MessageDto) {
        MessageDto messageDto = outputHandlerService.handle(MessageDto);
//        dataTransferService.transferDataForSave(MessageDto);
    }

    private void processError(MessageDto MessageDto){
//        dataTransferService.transferDataForSave(MessageDto);
    }

    private void processSourcecode(MessageDto MessageDto) {
        System.out.println(MessageDto.toString());
    }

}
