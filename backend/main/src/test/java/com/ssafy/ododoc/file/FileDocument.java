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

    public static final Snippet getfilePathFields = pathParameters(
            parameterWithName("directoryId").attributes(required()).description("조회할 파일 아이디")
    );

    public static final Snippet fileResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.directoryId").type(JsonFieldType.NUMBER).description("파일 아이디"),
            fieldWithPath("data.title").type(JsonFieldType.STRING).description("파일 제목"),
            fieldWithPath("data.content").optional().type(JsonFieldType.ARRAY).description("파일 내용 리스트"),
            fieldWithPath("data.content[].id").type(JsonFieldType.STRING).description("블럭 아이디"),
            fieldWithPath("data.content[].value").type(JsonFieldType.ARRAY).description("블럭 내용"),
            fieldWithPath("data.content[].value[].id").type(JsonFieldType.STRING).description("value id"),
            fieldWithPath("data.content[].value[].type").type(JsonFieldType.STRING).description("value type"),
            fieldWithPath("data.content[].value[].children").type(JsonFieldType.ARRAY).description("value children"),
            fieldWithPath("data.content[].value[].children[].text").type(JsonFieldType.STRING).description("text"),
            fieldWithPath("data.content[].value[].props.nodeType").type(JsonFieldType.STRING).description("value props"),
            fieldWithPath("data.content[].type").type(JsonFieldType.STRING).description("블럭 타입"),
            fieldWithPath("data.content[].meta.order").type(JsonFieldType.NUMBER).description("블럭 순서"),
            fieldWithPath("data.content[].meta.depth").type(JsonFieldType.NUMBER).description("블럭 depth")
    );
}
