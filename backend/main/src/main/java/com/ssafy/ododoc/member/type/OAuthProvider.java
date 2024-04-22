package com.ssafy.ododoc.member.type;

public enum OAuthProvider {

    GOOGLE, KAKAO, NAVER;

    public static OAuthProvider getOAuthProvider(String inputProvider) {

        String convertProvider = inputProvider.toUpperCase();

        return switch (convertProvider){
            case "KAKAO" -> KAKAO;
            case "NAVER" -> NAVER;
            case "GOOGLE" -> GOOGLE;

            // TODO : ProviderNotSupportedException 만들어서 처리하기
            default -> null;
        };
    }
}
