package com.ssafy.ododoc.common;

import org.springframework.restdocs.snippet.Snippet;

import static com.ssafy.ododoc.common.DocumentFormatProvider.required;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.requestHeaders;

public class CommonDocument {

    public static final Snippet AccessTokenHeader = requestHeaders(
            headerWithName("Authorization").attributes(required()).description("access token")
    );
}