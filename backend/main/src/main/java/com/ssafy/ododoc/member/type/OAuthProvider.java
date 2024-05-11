package com.ssafy.ododoc.member.type;

import com.ssafy.ododoc.member.exception.ProviderNotSupportedException;

public enum OAuthProvider {

    GOOGLE, KAKAO, NAVER;

    public static OAuthProvider getOAuthProvider(String inputProvider) {

        String convertProvider = inputProvider.toUpperCase();

        return switch (convertProvider){
            case "KAKAO" -> KAKAO;
            case "NAVER" -> NAVER;
            case "GOOGLE" -> GOOGLE;

            default -> throw new ProviderNotSupportedException("지원하지 않는 플랫폼입니다.");
        };
    }
}
