package com.ssafy.ododoc.file;

import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.snippet.Snippet;

import static com.ssafy.ododoc.common.DocumentFormatProvider.required;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
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
            fieldWithPath("data.content[].value[].props.nodeType").type(JsonFieldType.STRING).description("value props nodeType"),
            fieldWithPath("data.content[].value[].props.checked").type(JsonFieldType.BOOLEAN).description("value props checked"),
            fieldWithPath("data.content[].type").type(JsonFieldType.STRING).description("블럭 타입"),
            fieldWithPath("data.content[].meta.order").type(JsonFieldType.NUMBER).description("블럭 순서"),
            fieldWithPath("data.content[].meta.depth").type(JsonFieldType.NUMBER).description("블럭 depth")
    );

    public static final Snippet addRequestFields = requestFields(
            fieldWithPath("connectedFileId").type(JsonFieldType.NUMBER).attributes(required()).description("저장할 파일 아이디"),
            fieldWithPath("type").type(JsonFieldType.STRING).attributes(required()).description("success, fail, search"),
            fieldWithPath("visitedCount").optional().type(JsonFieldType.NUMBER).attributes(required()).description("type이 search일 경우, 방문 횟수 (null 가능)"),
            fieldWithPath("fileBlock").type(JsonFieldType.ARRAY).attributes(required()).description("저장할 파일 내용"),
            fieldWithPath("fileBlock[].id").type(JsonFieldType.STRING).attributes(required()).description("블럭 아이디"),
            fieldWithPath("fileBlock[].value").type(JsonFieldType.ARRAY).attributes(required()).description("블럭 value"),
            fieldWithPath("fileBlock[].value[].id").type(JsonFieldType.STRING).description("value id"),
            fieldWithPath("fileBlock[].value[].type").type(JsonFieldType.STRING).description("value type"),
            fieldWithPath("fileBlock[].value[].children").type(JsonFieldType.ARRAY).description("value children"),
            fieldWithPath("fileBlock[].value[].children[].text").type(JsonFieldType.STRING).description("text"),
            fieldWithPath("fileBlock[].value[].props.nodeType").type(JsonFieldType.STRING).description("value props nodeType"),
            fieldWithPath("fileBlock[].value[].props.checked").type(JsonFieldType.BOOLEAN).description("value props checked"),
            fieldWithPath("fileBlock[].type").type(JsonFieldType.STRING).description("블럭 타입"),
            fieldWithPath("fileBlock[].meta.order").type(JsonFieldType.NUMBER).description("블럭 순서"),
            fieldWithPath("fileBlock[].meta.depth").type(JsonFieldType.NUMBER).description("블럭 depth")
    );
}
