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

    public static final Snippet filePathFields = pathParameters(
            parameterWithName("actionType").attributes(required()).description("save 또는 add")
    );

    public static final Snippet getfilePathFields = pathParameters(
            parameterWithName("directoryId").attributes(required()).description("조회할 파일 아이디")
    );

    public static final Snippet fileResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.directoryId").type(JsonFieldType.NUMBER).description("저장할 파일 아이디"),
            fieldWithPath("data.content").optional().type(JsonFieldType.ARRAY).description("파일 내용 리스트"),
            fieldWithPath("data.content[].id").type(JsonFieldType.STRING).description("블럭 아이디"),
            fieldWithPath("data.content[].type").type(JsonFieldType.STRING).description("블럭 타입"),
            fieldWithPath("data.content[].props.textColor").optional().type(JsonFieldType.STRING).description("블럭 색"),
            fieldWithPath("data.content[].props.backgroundColor").optional().type(JsonFieldType.STRING).description("블럭 배경 색"),
            fieldWithPath("data.content[].props.textAlignment").optional().type(JsonFieldType.STRING).description("블럭 텍스트 위치"),
            fieldWithPath("data.content[].props.level").optional().type(JsonFieldType.NUMBER).description("블럭 제목 레벨"),
            fieldWithPath("data.content[].props.data").optional().type(JsonFieldType.STRING).description("코드, 터미널 블럭의 내용"),
            fieldWithPath("data.content[].content").type(JsonFieldType.ARRAY).description("블럭 내용 리스트"),
            fieldWithPath("data.content[].content[].type").type(JsonFieldType.STRING).description("블럭 내용 타입"),
            fieldWithPath("data.content[].content[].text").type(JsonFieldType.STRING).description("블럭 내용"),
            fieldWithPath("data.content[].content[].styles").optional().type(JsonFieldType.OBJECT).description("블럭 내용 스타일"),
            fieldWithPath("data.content[].content[].styles.bold").optional().type(JsonFieldType.BOOLEAN).description("블럭 내용 텍스트 굵기"),
            fieldWithPath("data.content[].content[].styles.italic").optional().type(JsonFieldType.BOOLEAN).description("블럭 내용 텍스트 기울임체"),
            fieldWithPath("data.content[].content[].styles.underline").optional().type(JsonFieldType.BOOLEAN).description("블럭 내용 텍스트 밑줄"),
            fieldWithPath("data.content[].content[].styles.strike").optional().type(JsonFieldType.BOOLEAN).description("블럭 내용 텍스트 취소선"),
            fieldWithPath("data.content[].content[].styles.code").optional().type(JsonFieldType.BOOLEAN).description("블럭 내용 텍스트 코드"),
            fieldWithPath("data.content[].content[].styles.textColor").optional().type(JsonFieldType.STRING).description("블럭 내용 텍스트 색"),
            fieldWithPath("data.content[].content[].styles.backgroundColor").optional().type(JsonFieldType.STRING).description("블럭 내용 텍스트 배경 색"),
            fieldWithPath("data.content[].children").optional().type(JsonFieldType.ARRAY).description("하위 내용")
    );
}
