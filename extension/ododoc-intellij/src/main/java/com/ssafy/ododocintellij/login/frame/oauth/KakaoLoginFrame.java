package com.ssafy.ododocintellij.login.frame.oauth;

import com.ssafy.ododocintellij.login.token.TokenManager;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

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

        TokenManager tokenManager = TokenManager.getInstance();

        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) ->{

            // 화면이 성공적으로 전환이 되었을 때
            if(newState == Worker.State.SUCCEEDED) {
                System.out.println(webEngine.getLocation());

                // 응답을 받을 화면이 나온다면
                if(webEngine.getLocation().contains(REDIRECT_URI)) {

                    String content = (String) webEngine.executeScript("document.body.textContent");

                    Long status;
                    JSONParser jsonParser = new JSONParser();

                    try {
                        JSONObject json = (JSONObject) jsonParser.parse(content);
                        status = (Long) json.get("status");
                        JSONObject data = (JSONObject) json.get("data");
                        tokenManager.setAccessToken((String) data.get("accessToken"));

                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }

                    // 쿠키의 refresh 토큰을 저장 싱글톤 객체에 저장
                    cookieManager.getCookieStore().getCookies().forEach(cookie -> {
                        if(cookie.getName().equals("refreshToken")){
                            tokenManager.setRefreshToken(cookie.getValue());
                        }
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

        Scene scene = new Scene(layout, 450, 700);
        setScene(scene);
        show();
    }
}

