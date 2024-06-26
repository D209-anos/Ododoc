package com.ssafy.ododoc.member;

import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.snippet.Snippet;

import static com.ssafy.ododoc.common.DocumentFormatProvider.required;
import static org.springframework.restdocs.cookies.CookieDocumentation.cookieWithName;
import static org.springframework.restdocs.cookies.CookieDocumentation.requestCookies;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

public class MemberDocument {

    public static final Snippet providerPathField = pathParameters(
            parameterWithName("provider").attributes(required()).description("path에 들어가는 provider(google, naver, kakao)")
    );

    public static final Snippet loginRequestField = requestFields(
            fieldWithPath("code").type(JsonFieldType.STRING).attributes(required()).description("OAuth 공급자로부터 오는 code"),
            fieldWithPath("url").type(JsonFieldType.STRING).attributes(required()).description("redirect url")
    );

    public static final Snippet refreshTokenCookieRequestField = requestCookies(
            cookieWithName("refreshToken").attributes(required()).description("refresh token 이 담긴 cookie")
    );

    public static final Snippet loginResultResponseField = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.accessToken").type(JsonFieldType.STRING).description("JWT 액세스 토큰"),
            fieldWithPath("data.tokenType").type(JsonFieldType.STRING).description("JWT 토큰 타입"),
            fieldWithPath("data.oAuthProvider").type(JsonFieldType.STRING).description("OAuth 제공자"),
            fieldWithPath("data.rootId").type(JsonFieldType.NUMBER).description("root directory id"),
            fieldWithPath("data.title").type(JsonFieldType.STRING).description("root name"),
            fieldWithPath("data.type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE")
    );

    public static final Snippet issueResponseField = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.accessToken").type(JsonFieldType.STRING).description("JWT 액세스 토큰"),
            fieldWithPath("data.tokenType").type(JsonFieldType.STRING).description("JWT 토큰 타입"),
            fieldWithPath("data.oAuthProvider").type(JsonFieldType.STRING).description("OAuth 제공자")
    );
}
