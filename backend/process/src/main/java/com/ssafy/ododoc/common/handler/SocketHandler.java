package com.ssafy.ododoc.common.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.service.DataTypeHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {

    private final DataTypeHandlerService dataTypeHandlerService;
    private final ObjectMapper objectMapper;

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
        MessageDto MessageDto = objectMapper.readValue(message.getPayload(), MessageDto.class);
        dataTypeHandlerService.handle(MessageDto);
    }

}