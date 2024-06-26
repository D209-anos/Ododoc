package com.ssafy.ododoc.member.util;

import com.ssafy.ododoc.member.dto.response.KakaoMemberInfoResponse;
import com.ssafy.ododoc.member.dto.response.KakaoTokenResponse;
import com.ssafy.ododoc.member.exception.OAuthDeniedException;
import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@PropertySource("classpath:oauth.properties")
public class KakaoOAuth2Utils {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-url}")
    private String kakaoTokenUrl;

    @Value("${kakao.info-url}")
    private String kakaoInfoUrl;

    public KakaoMemberInfoResponse getUserInfo(String code, String redirect) {
        if(redirect == null){
            redirect = redirectUri;
        }

        String kakaoAccessToken = getKakaoToken(code, redirect);

        WebClient webClient = WebClient.builder()
                .baseUrl(kakaoInfoUrl)
                .defaultHeader("Authorization","Bearer " + kakaoAccessToken)
                .defaultHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
                .build();

        return webClient.get()
                .retrieve()
                .bodyToMono(KakaoMemberInfoResponse.class)
                .block();
    }

    public String getKakaoToken(String code, String redirect) {
        WebClient webClient = WebClient.builder()
                .baseUrl(kakaoTokenUrl)
                .defaultHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
                .build();

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("client_id", clientId);
        requestBody.add("redirect_uri", redirect);
        requestBody.add("code", code);

        KakaoTokenResponse kakaoTokenResponse = webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(KakaoTokenResponse.class)
                .onErrorMap(e -> new OAuthDeniedException("유효하지 않은 정보입니다."))
                .block();

        if(kakaoTokenResponse != null){
            return kakaoTokenResponse.getAccessToken();
        }

        throw new OAuthInfoNullException("존재하지 않는 사용자입니다.");
    }
}
