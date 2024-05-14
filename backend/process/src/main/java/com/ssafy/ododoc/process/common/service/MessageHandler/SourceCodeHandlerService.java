package com.ssafy.ododoc.process.common.service.MessageHandler;

import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SourceCodeHandlerService {
    public void handle(MessageDto messageDto){
        System.out.println("SourceCodeHandlerService");
    }
}
