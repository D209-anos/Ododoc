package com.ssafy.ododoc.member.util;

import com.ssafy.ododoc.member.dto.response.NaverMemberInfoResponse;
import com.ssafy.ododoc.member.dto.response.NaverTokenResponse;
import com.ssafy.ododoc.member.exception.OAuthDeniedException;
import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:oauth.properties")
public class NaverOAuth2Utils {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.redirect-url}")
    private String redirectUrl;

    @Value("${naver.token-url}")
    private String tokenUrl;

    @Value("${naver.info-url}")
    private String infoUrl;

    public NaverMemberInfoResponse getUserInfo(String code, String redirect) {
        if(redirect == null){
            redirect = redirectUrl;
        }

        String NaverAccessToken = getAccessToken(code, redirect);

        WebClient webClient = WebClient.builder()
                .baseUrl(infoUrl)
                .defaultHeader("Authorization", "Bearer " + NaverAccessToken)
                .build();

        return webClient.get()
                .retrieve()
                .bodyToMono(NaverMemberInfoResponse.class)
                .block();
    }

    private String getAccessToken(String code, String redirect) {
        WebClient webClient = WebClient.builder()
                .baseUrl(tokenUrl)
                .build();

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("code", code);

        NaverTokenResponse naverTokenResponse = webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(NaverTokenResponse.class)
                .onErrorMap(e -> new OAuthDeniedException("유효하지 않은 정보입니다."))
                .block();

        if(naverTokenResponse != null){
            return naverTokenResponse.getAccessToken();
        }

        throw new OAuthInfoNullException("존재하지 않는 사용자입니다.");
    }
}
