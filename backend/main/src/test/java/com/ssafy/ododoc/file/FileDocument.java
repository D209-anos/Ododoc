package com.ssafy.ododoc.file;

import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.snippet.Snippet;

import static com.ssafy.ododoc.common.DocumentFormatProvider.required;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

public class FileDocument {

    public static final Snippet imagePathFields = pathParameters(
            parameterWithName("directoryId").attributes(required()).description("이미지를 업로드 할 파일 아이디")
    );

    public static final Snippet imageResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("이미지를 업로드 한 파일 아이디"),
            fieldWithPath("data.imageUrl").type(JsonFieldType.STRING).description("이미지 S3 URL")
    );
}
