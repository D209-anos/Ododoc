package com.ssafy.ododocintellij.sender;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;

public class BuildResultSender {

    // volatile 키워드를 사용하여 메모리 가시성 문제 해결, 멀티스레드 환경에서도 변수가 안전하게 사용할 수 있도록 함.
    private static volatile WebSocketClient INSTANCE;

    // 객체의 락을 위해 사용.
    private static final Object lock = new Object();

    private BuildResultSender() {}

    public static WebSocketClient getINSTANCE(String url) {
        if(INSTANCE == null) {
            // 두 번째로 null 체크를 한 후 다중 스레드 환경에서 동시에 여러 인스턴스가 생성되는 것을 방지
            synchronized (lock) {
                if(INSTANCE == null){
                    try {
                        INSTANCE = new WebSocketClient(new URI(url)) {
                            @Override
                            public void onOpen(ServerHandshake serverHandshake) {}

                            @Override
                            public void onMessage(String s) {}

                            @Override
                            public void onClose(int i, String s, boolean b) {}

                            @Override
                            public void onError(Exception e) {}
                        };
                        INSTANCE.connect();
                    }catch (URISyntaxException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        return INSTANCE;
    }

    public static void sendMessage(String message) {
        if(INSTANCE != null && INSTANCE.isOpen()){
            INSTANCE.send(message);
        }
    }

    public static void closeConnection() {
        if(INSTANCE != null && INSTANCE.isOpen()){
            INSTANCE.close();
        }
    }

}
