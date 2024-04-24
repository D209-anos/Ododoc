package com.ssafy.ododoc.directory;

import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.snippet.Snippet;

import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;

public class DirectoryDocument {

    public static final Snippet profileResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.buildCount").type(JsonFieldType.NUMBER).description("빌드 횟수"),
            fieldWithPath("data.errorCount").type(JsonFieldType.NUMBER).description("에러 횟수"),
            fieldWithPath("data.visitCount").type(JsonFieldType.NUMBER).description("방문 횟수"),
            fieldWithPath("data.searchCount").type(JsonFieldType.NUMBER).description("검색 횟수")
    );
}
