package com.ssafy.ododocintellij.login.frame;

import com.ssafy.ododocintellij.login.alert.AlertHelper;
import com.ssafy.ododocintellij.login.frame.oauth.KakaoLoginFrame;
import com.ssafy.ododocintellij.login.frame.oauth.NaverLoginFrame;
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
        setTitle(" Ododoc");
        VBox layout = new VBox(10);
        layout.setAlignment(Pos.CENTER);

        Image windowIcon = new Image(getClass().getResourceAsStream("/image/button/icon.png"));
        getIcons().add(windowIcon);

        TokenManager tokenManager = TokenManager.getInstance();
        setOnCloseRequest(event -> {
            if(tokenManager.getAccessToken() == null || tokenManager.getRefreshToken() == null){
                Alert alert = AlertHelper.makeAlert(
                        Alert.AlertType.CONFIRMATION,
                        " Ododoc",
                        "로그인 필요",
                        "Ododoc 서비스를 이용하려면 로그인이 필요합니다.\n정말 종료하시겠습니까?",
                        "/image/button/icon.png"
                );

                Optional<ButtonType> result = alert.showAndWait();
                if(result.isPresent() && result.get() != ButtonType.OK) {
                    event.consume();
                }
            }
        });

        // 카카오 로그인 버튼
        ImageView kakaoBtnImageView = new ImageView(new Image(getClass().getResourceAsStream("/image/button/kakao_login_medium_narrow.png")));
        kakaoBtnImageView.setFitWidth(183);
        kakaoBtnImageView.setFitHeight(45);
        Button kakaoLoginBtn = new Button("", kakaoBtnImageView);
        kakaoLoginBtn.setStyle("-fx-background-color: transparent; -fx-padding: 3, 3, 3, 3;");

        kakaoLoginBtn.setOnAction(e -> {
            try {
                onLogin("kakao");
            } catch (URISyntaxException ex) {
                throw new RuntimeException(ex);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });

        // 네이버 로그인 버튼
        ImageView naverBtnImageView = new ImageView(new Image(getClass().getResourceAsStream("/image/button/naver_login.png")));
        naverBtnImageView.setFitWidth(183);
        naverBtnImageView.setFitHeight(45);
        Button naverLoginBtn = new Button("", naverBtnImageView);
        naverLoginBtn.setStyle("-fx-background-color: transparent; -fx-padding: 3, 3, 3, 3;");

        naverLoginBtn.setOnAction(e -> {
            try {
                onLogin("naver");
            } catch (URISyntaxException ex) {
                throw new RuntimeException(ex);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });

        layout.getChildren().addAll(kakaoLoginBtn, naverLoginBtn);

        Scene scene = new Scene(layout, 300, 400);
        setScene(scene);
        show();
    }

    private void onLogin(String social) throws URISyntaxException, IOException {
        switch (social){
            case "kakao" -> {
                new KakaoLoginFrame(this);
            }
            case "naver" -> {
                new NaverLoginFrame(this);
            }
        }
    }

}