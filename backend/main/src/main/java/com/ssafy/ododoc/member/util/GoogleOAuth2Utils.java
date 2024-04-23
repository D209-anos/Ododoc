package com.ssafy.ododoc.member.util;

import com.ssafy.ododoc.member.dto.response.GoogleMemberInfoResponse;
import com.ssafy.ododoc.member.dto.response.GoogleTokenResponse;
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
public class GoogleOAuth2Utils {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String goolgeRedirectUri;

    @Value("${google.token-url}")
    private String googleTokenUrl;

    @Value("${google.info-url}")
    private String googleInfoUrl;

    public GoogleMemberInfoResponse getUserInfo(String code, String redirect) {
        if(redirect == null){
            redirect = goolgeRedirectUri;
        }

        String googleAccessToken = getGoogleToken(code,redirect);

        WebClient webClient = WebClient.builder()
                .baseUrl(googleInfoUrl)
                .defaultHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
                .defaultHeader("Authorization", "Bearer " + googleAccessToken)
                .build();

        return webClient.get()
                .retrieve()
                .bodyToMono(GoogleMemberInfoResponse.class)
                .block();
    }
    public String getGoogleToken (String code, String redirect) {
        WebClient webClient = WebClient.builder()
                .baseUrl(googleTokenUrl)
                .defaultHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8")
                .build();

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("redirect_uri", redirect);
        requestBody.add("code", code);
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);

        GoogleTokenResponse googleTokenResponse = webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GoogleTokenResponse.class)
                .onErrorMap(e -> new OAuthDeniedException("유효하지 않은 정보입니다."))
                .block();

        if(googleTokenResponse != null){
            return googleTokenResponse.getAccessToken();
        }

        throw new OAuthInfoNullException("존재하지 않는 사용자입니다.");
    }
}
