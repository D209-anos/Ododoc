package com.ssafy.ododoc.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ProcessController {
    @MessageMapping("/hello")
    @SendTo("/sub/greetings")
    public String greeting(String message) throws Exception {
        return "Hello, " + message + "!";
    }
}
