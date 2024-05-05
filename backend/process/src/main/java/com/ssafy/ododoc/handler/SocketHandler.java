package com.ssafy.ododoc.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {
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
        String payload = message.getPayload();
        System.out.println("payload: " + payload);
        System.out.println("session.id: " + session.getId());
        System.out.println("session.principal: " + session.getPrincipal());
        System.out.println("session.uri: " + session.getUri());
        System.out.println("session.attributes: " + session.getAttributes());
        System.out.println("session.handshakeHeaders: " + session.getHandshakeHeaders());
        System.out.println("session.localAddress: "+ session.getLocalAddress());
        System.out.println("session.remoteAddress: " + session.getRemoteAddress());

        switch (payload){
            case "Terminal":
                System.out.println("Terminal");
                System.out.println(payload);
                break;

            case "SCM":
                System.out.println("SCM");
                System.out.println(payload);
                break;

            default:
                System.out.println("default");
                System.out.println(payload);
                break;
        }
    }
}