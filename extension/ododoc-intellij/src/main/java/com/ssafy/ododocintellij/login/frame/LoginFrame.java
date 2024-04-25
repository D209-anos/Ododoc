package com.ssafy.ododocintellij.login.frame;

import com.ssafy.ododocintellij.login.oauth.KakaoLogin;

import javax.swing.*;
import java.io.IOException;
import java.net.URISyntaxException;

public class LoginFrame extends JFrame {

    ImageIcon kakaoBtnImage = new ImageIcon(getClass().getResource("/image/button/kakao_login_medium_narrow.png"));

    public LoginFrame() {
        setTitle("Ododoc 로그인");
        setLayout(null);
        setSize(300, 400);
        setVisible(true);

        JButton kakaoLoginBtn = new JButton(kakaoBtnImage);
        kakaoLoginBtn.setBounds(55, 100, kakaoBtnImage.getIconWidth(), kakaoBtnImage.getIconHeight());
        kakaoLoginBtn.setBorderPainted(false);
        kakaoLoginBtn.addActionListener(e -> {
            try {
                onLogin("kakao");
            } catch (URISyntaxException ex) {
                throw new RuntimeException(ex);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });
        add(kakaoLoginBtn);

    }

    private void onLogin(String social) throws URISyntaxException, IOException {
        switch (social){
            case "kakao" -> {
                new KakaoLogin().DoLogin();
            }
        }
    }
}