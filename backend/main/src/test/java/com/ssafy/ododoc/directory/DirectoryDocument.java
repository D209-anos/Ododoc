package com.ssafy.ododoc.directory;

import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.snippet.Snippet;

import static com.ssafy.ododoc.common.DocumentFormatProvider.required;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

public class DirectoryDocument {

    public static final Snippet profileResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.buildCount").type(JsonFieldType.NUMBER).description("빌드 횟수"),
            fieldWithPath("data.errorCount").type(JsonFieldType.NUMBER).description("에러 횟수"),
            fieldWithPath("data.visitCount").type(JsonFieldType.NUMBER).description("방문 횟수"),
            fieldWithPath("data.searchCount").type(JsonFieldType.NUMBER).description("검색 횟수")
    );

    public static final Snippet createRequestFields = requestFields(
            fieldWithPath("parentId").optional().type(JsonFieldType.NUMBER).attributes(required()).description("상위 폴더의 id를 입력해 주세요. 없다면 null을 입력해 주세요."),
            fieldWithPath("name").optional().type(JsonFieldType.STRING).attributes(required()).description("폴더/파일 명을 입력해 주세요. 없다면 빈 문자열을 입력해 주세요."),
            fieldWithPath("type").type(JsonFieldType.STRING).attributes(required()).description("FOLDER 또는 FILE을 입력해 주세요.")
    );

    public static final Snippet createResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("새로 생성된 폴더/파일의 아이디"),
            fieldWithPath("data.name").type(JsonFieldType.STRING).description("폴더/파일명"),
            fieldWithPath("data.type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE"),
            fieldWithPath("data.parentId").optional().type(JsonFieldType.NUMBER).description("상위 폴더 아이디 (null 가능)")
    );

    public static final Snippet deletePathFields = pathParameters(
            parameterWithName("option").attributes(required()).description("휴지통 삭제(trashbin) 또는 영구 삭제(delete)"),
            parameterWithName("directoryId").attributes(required()).description("삭제할 폴더/파일 아이디")
    );

    public static final Snippet deleteResponseFileds = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("삭제된 폴더/파일 아이디"),
            fieldWithPath("data.trashbinTime").type(JsonFieldType.STRING).description("휴지통 삭제된 시간"),
            fieldWithPath("data.deletedTime").optional().type(JsonFieldType.STRING).description("영구 삭제된 시간"),
            fieldWithPath("data.type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE")
    );

    public static final Snippet editRequestFields = requestFields(
            fieldWithPath("id").type(JsonFieldType.NUMBER).description("변경할 디렉토리 아이디"),
            fieldWithPath("name").type(JsonFieldType.STRING).description("변경할 이름")
    );

    public static final Snippet editResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("변경된 디렉토리 아이디"),
            fieldWithPath("data.name").type(JsonFieldType.STRING).description("변경된 이름")
    );

    public static final Snippet moveRequestFields = requestFields(
      fieldWithPath("id").type(JsonFieldType.NUMBER).description("이동할 폴더/파일 아이디"),
      fieldWithPath("parentId").optional().type(JsonFieldType.NUMBER).description("이동할 폴더/파일의 상위 폴더 아이디")
    );

    public static final Snippet moveResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("이동된 폴더/파일 아이디"),
            fieldWithPath("data.newParentId").optional().type(JsonFieldType.NUMBER).description("이동된 폴더/파일의 상위 폴더 아이디")
    );

    public static final Snippet getPathFields = pathParameters(
            parameterWithName("rootId").attributes(required()).description("삭제할 폴더/파일 아이디")
    );

    public static final Snippet getResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("rootId"),
            fieldWithPath("data.name").type(JsonFieldType.STRING).description("폴더/파일 명"),
            fieldWithPath("data.type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE"),
            fieldWithPath("data.children").type(JsonFieldType.ARRAY).description("하위 폴더 리스트"),
            fieldWithPath("data.children[].id").type(JsonFieldType.NUMBER).description("폴더/파일 아이디"),
            fieldWithPath("data.children[].name").type(JsonFieldType.STRING).description("폴더/파일 명"),
            fieldWithPath("data.children[].type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE"),
            fieldWithPath("data.children[].children").type(JsonFieldType.ARRAY).description("하위 폴더 리스트"),
            fieldWithPath("data.children[].children[].id").type(JsonFieldType.NUMBER).description("폴더/파일 아이디"),
            fieldWithPath("data.children[].children[].name").type(JsonFieldType.STRING).description("폴더/파일 명"),
            fieldWithPath("data.children[].children[].type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE"),
            fieldWithPath("data.children[].children[].children").type(JsonFieldType.ARRAY).description("하위 폴더 리스트")
    );

    public static final Snippet restorePathFields = pathParameters(
            parameterWithName("directoryId").attributes(required()).description("복원할 폴더/파일 아이디")
    );

    public static final Snippet restoreResponseFields = responseFields(
            fieldWithPath("status").type(JsonFieldType.NUMBER).description("HTTP 상태 코드"),
            fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("복원할 폴더/파일 아이디"),
            fieldWithPath("data.trashbinTime").optional().type(JsonFieldType.STRING).description("휴지통 삭제된 시간"),
            fieldWithPath("data.deletedTime").optional().type(JsonFieldType.STRING).description("영구 삭제된 시간"),
            fieldWithPath("data.type").type(JsonFieldType.STRING).description("FOLDER 또는 FILE")
    );
}
