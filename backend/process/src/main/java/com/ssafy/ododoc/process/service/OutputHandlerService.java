package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import org.springframework.stereotype.Component;

@Component
public class OutputHandlerService {
    private MessageDto messageDto;
    public MessageDto processOutput(MessageDto messageDataInput) {
        messageDto = messageDataInput;

        System.out.println("process start");

        a();
        b();

        System.out.println("process end");

        return messageDto;
    }
    private void a() {

    }

    private void b() {
        System.out.println("process 2");
    }


}
