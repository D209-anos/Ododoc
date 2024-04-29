package com.ssafy.ododocintellij.login.frame;

import com.ssafy.ododocintellij.login.token.TokenManager;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class TokenCheckFrame extends Stage {

    public TokenCheckFrame() {
        setTitle("토큰 확인");

        VBox layout = new VBox(10);
        layout.setAlignment(Pos.CENTER);

        TokenManager tokenManager = TokenManager.getInstance();

        TextField accessTokenFiled = new TextField();
        TextField refreshTokenFiled = new TextField();

        accessTokenFiled.setText("액세스 토큰: " + tokenManager.getAccessToken());
        refreshTokenFiled.setText("리프레시 토큰: " + tokenManager.getRefreshToken());

        accessTokenFiled.setStyle("-fx-background-color: transparent; -fx-padding: 5, 5, 5, 5;");
        refreshTokenFiled.setStyle("-fx-background-color: transparent; -fx-padding: 5, 5, 5, 5;");

        layout.getChildren().add(accessTokenFiled);
        layout.getChildren().add(refreshTokenFiled);

        Scene scene = new Scene(layout, 300, 400);
        setScene(scene);
        show();
    }
}
