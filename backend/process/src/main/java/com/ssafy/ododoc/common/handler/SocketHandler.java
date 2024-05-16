package com.ssafy.ododoc.common.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.vscode.service.MessageProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final MessageProcessingService messageProcessingService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        MessageDto messageDto = objectMapper.readValue(message.getPayload(), MessageDto.class);
        switch (messageDto.getSourceApplication()) {
            case VSCODE -> messageProcessingService.handle(messageDto, session);
            case IntelliJ -> System.out.println("IntelliJ");
            case Chrome -> System.out.println("Chrome");
        }
    }

}