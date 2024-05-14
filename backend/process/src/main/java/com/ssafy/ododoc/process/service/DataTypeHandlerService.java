package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.service.MessageHandler.OutputHandlerService;
import com.ssafy.ododoc.process.service.MessageHandler.SourceCodeHandlerService;
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
    private final SourceCodeHandlerService sourceCodeHandlerService;

    public void handle(MessageDto messageDto) {

        DataType dataType = messageDto.getDataType();
        System.out.println(dataType);
        System.out.println(messageDto.getContent());
        switch (dataType) {
            case SIGNAL:
                processSignal(messageDto);
                break;

            case OUTPUT:
                processOutput(messageDto);
                break;

            case ERROR:
                processError(messageDto);
                dataTransferService.transferDataForSave(messageDto);
                break;

            case KEYWORD:
                processKeyword(messageDto);;

            case SEARCH:
                processSearch(messageDto);
                break;

            default:
                log.info("잘못된 데이터 타입");
                break;
        }

        // main으로 데이터 전송 로직 추가
    }

    private void processSignal(MessageDto MessageDto) {
        System.out.println(MessageDto.toString());
    }

    private void processOutput(MessageDto MessageDto) {
        MessageDto messageDto = outputHandlerService.handle(MessageDto);
//        dataTransferService.transferDataForSave(MessageDto);
    }

    private void processError(MessageDto MessageDto) {
//        dataTransferService.transferDataForSave(MessageDto);
    }

    private void processKeyword(MessageDto MessageDto) {
        System.out.println(MessageDto.toString());
    }

    private void processSearch(MessageDto MessageDto) {
        System.out.println(MessageDto.toString());
    }
}
