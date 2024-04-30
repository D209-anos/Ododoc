package com.ssafy.ododocintellij.login.oauth;

import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.net.CookieHandler;
import java.net.CookieManager;

import static java.net.CookiePolicy.ACCEPT_ALL;

public class KakaoLoginFrame extends Stage {

    private final String CLIENT_ID = "a23282fc18f2b445d559dfe93fa96e6b";
    private final String REDIRECT_URI = "http://localhost:8080/api/oauth2/authorization/kakao";

    public KakaoLoginFrame(){
        setTitle("Login with Kakao");

        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(ACCEPT_ALL);
        CookieHandler.setDefault(cookieManager);

        VBox layout = new VBox();
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();

        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) ->{
            if(newState == Worker.State.SUCCEEDED) {
                System.out.println(webEngine.getLocation());
                if(webEngine.getLocation().contains(REDIRECT_URI)) {
                    System.out.println("진입");
                    cookieManager.getCookieStore().getCookies().forEach(cookie -> {
                        System.out.println("쿠키 이름: " + cookie.getName());
                        System.out.println("쿠키 값: " + cookie.getValue());
                    });
                }
            }
        });

        webView.getEngine().load(
                "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id="
                        + CLIENT_ID
                        +"&redirect_uri="
                        + REDIRECT_URI);

        layout.getChildren().add(webView);

        Scene scene = new Scene(layout, 400, 600);
        setScene(scene);
        show();
    }
}

