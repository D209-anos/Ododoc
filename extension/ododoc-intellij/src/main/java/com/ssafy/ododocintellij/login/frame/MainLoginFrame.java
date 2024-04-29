package com.ssafy.ododocintellij.login.frame;

import com.ssafy.ododocintellij.login.oauth.KakaoLoginFrame;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URISyntaxException;

public class MainLoginFrame extends Stage {

    public MainLoginFrame() {
        setTitle("Ododoc 로그인");

        VBox layout = new VBox(10);
        layout.setAlignment(Pos.CENTER);

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

        layout.getChildren().add(kakaoLoginBtn);

        Scene scene = new Scene(layout, 300, 400);
        setScene(scene);
        show();
    }

    private void onLogin(String social) throws URISyntaxException, IOException {
        switch (social){
            case "kakao" -> {
                new KakaoLoginFrame();
            }
        }
    }
}