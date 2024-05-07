package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.data.MessageData;
import org.springframework.stereotype.Component;

@Component
public class OutputHandlerService {
    private MessageData messageData;
    public MessageData processOutput(MessageData messageDataInput) {
        messageData = messageDataInput;

        System.out.println("process start");

        a();
        b();

        System.out.println("process end");

        return messageData;
    }
    private void a() {

    }

    private void b() {
        System.out.println("process 2");
    }


}
