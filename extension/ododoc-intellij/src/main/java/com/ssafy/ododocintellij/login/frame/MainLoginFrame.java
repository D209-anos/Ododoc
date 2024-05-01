package com.ssafy.ododocintellij.login.frame;

import com.ssafy.ododocintellij.login.alert.AlertHelper;
import com.ssafy.ododocintellij.login.frame.oauth.KakaoLoginFrame;
import com.ssafy.ododocintellij.login.token.TokenManager;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Optional;

public class MainLoginFrame extends Stage {

    public MainLoginFrame() {
        setTitle("Ododoc 로그인");
        VBox layout = new VBox(10);
        layout.setAlignment(Pos.CENTER);

        TokenManager tokenManager = TokenManager.getInstance();
        setOnCloseRequest(event -> {
            if(tokenManager.getAccessToken() == null || tokenManager.getRefreshToken() == null){
                Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
                alert.setTitle("Ododoc IntelliJ Plugin");
                alert.setHeaderText("로그인 필요");
                alert.setContentText("Ododoc 서비스를 이용하려면 로그인이 필요합니다. 정말 종료하시겠습니까?");

                Optional<ButtonType> result = alert.showAndWait();
                if(result.isPresent() && result.get() != ButtonType.OK) {
                    event.consume();
                }
            }
        });

        // 카카오 로그인 버튼
        Image kakaoBtnImage = new Image(getClass().getResourceAsStream("/image/button/kakao_login_medium_narrow.png"));
        Button kakaoLoginBtn = new Button("", new ImageView(kakaoBtnImage));
        kakaoLoginBtn.setStyle("-fx-background-color: transparent; -fx-padding: 5, 5, 5, 5;");

        kakaoLoginBtn.setOnAction(e -> {
            try {
                onLogin("kakao");
            } catch (URISyntaxException ex) {
                throw new RuntimeException(ex);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });

        // 토큰 저장 확인 버튼
        Button checkBtn = new Button("확인");
        checkBtn.setStyle("-fx-background-color: transparent; -fx-padding: 5, 5, 5, 5;");
        checkBtn.setOnAction(e -> {
            onCheck();
        });


        layout.getChildren().add(kakaoLoginBtn);
        layout.getChildren().add(checkBtn);

        Scene scene = new Scene(layout, 300, 400);
        setScene(scene);
        show();
    }

    private void onLogin(String social) throws URISyntaxException, IOException {
        switch (social){
            case "kakao" -> {
                new KakaoLoginFrame(this);
            }
        }
    }

    private void onCheck(){
        new TokenCheckFrame();
    }
}