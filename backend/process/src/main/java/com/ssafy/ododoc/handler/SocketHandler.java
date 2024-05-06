package com.ssafy.ododoc.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.data.DataType;
import com.ssafy.ododoc.data.MessageData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("들어왔네 : " + session);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("afterConnectionClosed: " + session);
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        MessageData messageData = objectMapper.readValue(message.getPayload(), MessageData.class);

        DataType dataType = messageData.getDataType();
        switch (dataType){
            case SIGNAL:
                System.out.println(dataType);
                System.out.println(messageData.getContents());
                break;
            case OUTPUT:
                System.out.println(dataType);
                System.out.println(messageData.getContents());
                break;

            case ERROR:
                System.out.println(dataType);
                System.out.println(messageData.getContents());
                break;

            case SCM:
                System.out.println(dataType);
                System.out.println(messageData.getContents());
                break;

            default:
                System.out.println(dataType);
                break;
        }
    }
}