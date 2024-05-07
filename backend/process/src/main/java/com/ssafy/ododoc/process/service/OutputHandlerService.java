package com.ssafy.ododoc.process.service;

import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import com.ssafy.ododoc.process.dto.receive.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OutputHandlerService {
    private MessageDto messageData;
    private final GptService gptService;

    public MessageDto process(MessageDto messageDataInput) {
        messageData = messageDataInput;

        System.out.println("!output process start!");

        a();
        b();

        System.out.println("!output process end!");

        return messageData;
    }

    private void a() {
        System.out.println("===================process 1===================");
//        GptResponseDto chat = gptService.chat("gpt-3.5-turbo", messageData.getContent().toString() + "\n이거 요약해줘 ", "http://localhost:8080/api");
//        System.out.println(chat.getChoices().get(0).getMessage().getContent());
        System.out.println("===============================================");
    }

    private void b() {
        System.out.println("===================process 2===================");
        System.out.println("===============================================");
    }

}
