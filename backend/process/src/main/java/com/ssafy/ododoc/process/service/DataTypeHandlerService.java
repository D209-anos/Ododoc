package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.service.MessageHandler.OutputHandlerService;
import com.ssafy.ododoc.process.type.DataType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataTypeHandlerService {

    private final DataTransferService dataTransferService;
    private final OutputHandlerService outputHandlerService;

    public void handle(MessageDto messageDto) {
        DataType dataType = messageDto.getDataType();
        log.info("Data Type : {}", dataType);
        log.info("Message Content : {}", messageDto.getContent());

        switch (dataType){
            case SIGNAL:
                break;

            case OUTPUT:
                System.out.println(dataType);
                System.out.println(messageDto.getContent());
                outputHandlerService.process(messageDto);
                break;

            case ERROR:
                dataTransferService.transferDataForSave(messageDto);
                break;

            case SCM:
                break;

            default:
                log.info("잘못된 데이터 타입");
                break;
        }
    }

}
