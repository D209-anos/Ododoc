package com.ssafy.ododocintellij.login.oauth;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class KakaoLogin {

    public void DoLogin() throws URISyntaxException, IOException {
        Desktop.getDesktop().browse(new URI("https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=http://localhost:8080/api/oauth2/authorization/kakao"));
    }

}

