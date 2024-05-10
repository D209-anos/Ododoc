package com.ssafy.ododoc.directory;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.CommonDocument;
import com.ssafy.ododoc.common.MemberTestUtil;
import com.ssafy.ododoc.directory.util.DirectoryTestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DirectoryApiTest extends ApiTest {

    @Autowired
    private MemberTestUtil memberTestUtil;

    @Autowired
    private DirectoryTestUtil directoryTestUtil;

    @Autowired
    private DirectorySteps directorySteps;

    @Test
    void 프로필_조회_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);

        mockMvc.perform(
                get("/directory")
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "프로필을 조회하는 API 입니다." +
                                "<br><br><b>header에 올바른 JWT accessToken을 담아 get 요청</b> 해주세요." +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 프로필 관련 정보들</b>이 반환됩니다." +
                                "<br> - <b>header에 JWT accessToken을 입력하지 않으면</b>, <b>401 Unauthorized</b>가 반환됩니다.",
                        "프로필 조회", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.profileResponseFields));
    }

    @Test
    void 프로필_조회_토큰없음_401() throws Exception {
        mockMvc.perform(
                get("/directory")
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH));
    }

    @Test
    void 디렉토리_폴더생성_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성(rootId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "디렉토리(폴더/파일)를 생성하는 API 입니다." +
                        "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>body에 올바른 request</b>를 담아 <b>post 요청</b> 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 생성된 폴더/파일 정보들</b>이 반환됩니다." +
                        "<br> - 폴더/파일명이 없을 경우에는 <b>빈 문자열</b>을 보내주세요. 그렇지 않으면 <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - 폴더/파일명은 30자 이내여야 합니다. 그렇지 않으면 <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - 상위 폴더 아이디는 1 이상이어야 합니다. 1 미만인 경우, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - type에 <b>FOLDER 또는 FILE</b>이 아닌 값을 입력하면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더에 접근 권한이 없을 경우, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더를 찾을 수 없을 경우, <b>404 Not Found</b>가 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더가 이미 삭제(휴지통, 영구삭제) 되었다면, <b>404 Not Found</b>가 반환됩니다.",
                        "디렉토리(폴더/파일) 생성", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields, DirectoryDocument.createResponseFields
                        ));
    }

    @Test
    void 디렉토리_파일생성_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                        post("/directory")
                                .header(AUTH_HEADER, token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(parentId)))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields, DirectoryDocument.createResponseFields
                ));
    }

    @Test
    void 디렉토리_폴더생성_이름_30자이상_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성_이름_30자이상(rootId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));

    }

    @Test
    void 디렉토리_파일생성_이름null_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                        post("/directory")
                                .header(AUTH_HEADER, token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(directorySteps.파일정보_잘못생성_이름null(parentId)))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_파일생성_상위null_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);

        mockMvc.perform(
                        post("/directory")
                                .header(AUTH_HEADER, token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(directorySteps.파일정보_잘못생성_상위null()))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_파일생성_타입오류_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.파일정보_잘못생성_타입오류(parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_잘못된상위폴더_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = -1L;

        mockMvc.perform(
                        post("/directory")
                                .header(AUTH_HEADER, token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(parentId)))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_토큰없음_401() throws Exception {
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);

        mockMvc.perform(
                post("/directory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성(rootId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_상위폴더_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, otherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_없는상위폴더_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = 99999L;

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_삭제된상위폴더_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_삭제_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "폴더/파일을 삭제하는 API 입니다." +
                        "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>path에 올바른 option과 directoryId</b>를 담아 <b>delete 요청</b> 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 삭제된 폴더/파일 정보</b>가 반환됩니다." +
                        "<br> - option에 <b>trashbin 또는 delete</b>가 아닌 값을 입력하면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - directoryId는 <b>1 이상 값</b>을 입력 해주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                        "<br> - directoryId에 해당하는 폴더/파일에 접근 권한이 없을 경우, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - directoryId에 해당하는 폴더/파일을 찾을 수 없을 경우, <b>404 Not Found</b>가 반환됩니다." +
                        "<br> - directoryId에 해당하는 폴더가 최상위 폴더인 경우 삭제할 수 없습니다. <b>409 Conflict</b>가 반환됩니다." +
                        "<br> - directoryId에 해당하는 폴더/파일이 이미 삭제(휴지통, 영구삭제) 되었다면, <b>409 Conflict</b>가 반환됩니다.",
                        "디렉토리(폴더/파일) 삭제", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields, DirectoryDocument.deleteResponseFileds));
    }

    @Test
    void 디렉토리_삭제_잘못된_option_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "쓰레기통", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_잘못된_아이디_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = -1L;

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(AUTH_HEADER, otherToken)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_없는디렉토리_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = 99999L;

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_삭제된디렉토리_409() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(409))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리_삭제_최상위디렉토리_409() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);

        mockMvc.perform(
                        delete("/directory/{option}/{directoryId}", "trashbin", rootId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(409))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.deletePathFields));
    }

    @Test
    void 디렉토리명_변경_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "디렉토리명을 변경하는 API 입니다." +
                                "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>body에 올바른 request</b>를 담아 <b>put 요청</b> 해주세요." +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 변경된 폴더/파일 정보</b>가 반환됩니다." +
                                "<br> - id는 <b>1 이상 값</b>을 입력해 주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - name은 <b>비어있을 수 없습니다.</b> <b>null, '', ' '</b>을 입력하면, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                                "<br> - id에 해당하는 폴더/파일에 <b>접근 권한이 없을 경우</b>, <b>403 Forbidden</b>이 반환됩니다." +
                                "<br> - id에 해당하는 폴더/파일을 <b>찾을 수 없을 경우</b>, <b>404 Not Found</b>가 반환됩니다." +
                                "<br> - id에 해당하는 폴더/파일이 <b>이미 삭제(휴지통, 영구삭제) 되었다면</b>, <b>404 Not Found</b>가 반환됩니다.",
                        "디렉토리(폴더/파일)명 변경", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields, DirectoryDocument.editResponseFields
                        ));
    }

    @Test
    void 디렉토리명_변경_아이디오류_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = -1L;

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리명_변경_이름없음_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_이름없음(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리명_변경_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/edit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리명_변경_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, otherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리명_변경_디렉토리없음_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = 99999L;

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리명_변경_삭제된디렉토리_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                put("/directory/edit")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.변경디렉토리_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.editRequestFields));
    }

    @Test
    void 디렉토리_이동_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "디렉토리를 이동하는 API 입니다." +
                                "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>body에 올바른 request</b>를 담아 <b>put 요청</b> 해주세요." +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 이동된 폴더/파일 정보</b>가 반환됩니다." +
                                "<br> - id와 parentId는 <b>1 이상 값</b>을 입력해 주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - parentId에 해당하는 디렉토리가 <b>파일인 경우</b> 이동할 수 없습니다. <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                                "<br> - id 또는 parentId에 해당하는 폴더/파일에 <b>접근 권한이 없을 경우</b>, <b>403 Forbidden</b>이 반환됩니다." +
                                "<br> - id 또는 parentId에 해당하는 폴더/파일을 <b>찾을 수 없을 경우</b>, <b>404 Not Found</b>가 반환됩니다." +
                                "<br> - id 또는 parentId에 해당하는 폴더/파일이 <b>이미 삭제(휴지통, 영구삭제) 되었다면</b>, <b>409 Conflict</b>가 반환됩니다.",
                        "디렉토리(폴더/파일) 이동", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields, DirectoryDocument.moveResponseFields
                        ));
    }

    @Test
    void 디렉토리_이동_잘못된아이디_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long id = -1L;

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_이동_상위파일_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long parentId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_이동_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        mockMvc.perform(
                put("/directory/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_이동_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, otherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_이동_없는파일_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long id = 99999L;

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_이동_삭제폴더_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, parentId, mockMvc);

        mockMvc.perform(
                put("/directory/move")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.디렉토리이동_생성(id, parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.moveRequestFields));
    }

    @Test
    void 디렉토리_조회_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, id, mockMvc);
        directoryTestUtil.파일_생성(token, rootId, mockMvc);

        mockMvc.perform(
                get("/directory/{rootId}", rootId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "디렉토리를 조회하는 API 입니다." +
                        "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>path에 올바른 rootId</b>를 담아 <b>get 요청</b> 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 디렉토리 정보</b>가 반환됩니다." +
                        "<br> - rootId는 <b>1 이상 값</b>을 입력해 주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                        "<br> - rootId에 해당하는 디렉토리에 <b>접근 권한이 없을 경우</b>, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - rootId에 해당하는 디렉토리를 <b>찾을 수 없을 경우</b>, <b>404 Not Found</b>가 반환됩니다.",
                        "디렉토리 조회", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.getPathFields, DirectoryDocument.getResponseFields));
    }

    @Test
    void 디렉토리_조회_잘못된아이디_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, id, mockMvc);
        directoryTestUtil.파일_생성(token, rootId, mockMvc);
        Long wrongId = -1L;

        mockMvc.perform(
                        get("/directory/{rootId}", wrongId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.getPathFields));
    }

    @Test
    void 디렉토리_조회_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, id, mockMvc);
        directoryTestUtil.파일_생성(token, rootId, mockMvc);

        mockMvc.perform(
                        get("/directory/{rootId}", rootId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.getPathFields));
    }

    @Test
    void 디렉토리_조회_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, id, mockMvc);
        directoryTestUtil.파일_생성(token, rootId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                        get("/directory/{rootId}", rootId)
                                .header(AUTH_HEADER, otherToken)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.getPathFields));
    }

    @Test
    void 디렉토리_조회_없는디렉토리_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long id = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, id, mockMvc);
        directoryTestUtil.파일_생성(token, rootId, mockMvc);
        Long wrongId = 99999L;

        mockMvc.perform(
                        get("/directory/{rootId}", wrongId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.getPathFields));
    }

    @Test
    void 디렉토리_복원_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                put("/directory/restore/{directoryId}", directoryId)
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "휴지통 디렉토리를 복원하는 API 입니다." +
                        "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>path에 올바른 directoryId</b>를 담아 <b>put 요청</b> 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 복원된 디렉토리 정보</b>가 반환됩니다." +
                        "<br> - directoryId는 <b>1 이상 값</b>을 입력해 주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - directoryId에 해당하는 디렉토리가 <b>삭제되지 않은 경우</b>, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                        "<br> - directoryId에 해당하는 디렉토리에 <b>접근 권한이 없을 경우</b>, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - directoryId에 해당하는 디렉토리가 <b>이미 영구 삭제 되었거나 찾을 수 없을 경우</b>, <b>404 Not Found</b>가 반환됩니다.",
                        "디렉토리(폴더/파일) 복원", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields, DirectoryDocument.restoreResponseFields));
    }

    @Test
    void 디렉토리_복원_잘못된아이디_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        Long wrongDirectoryId = -1L;

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", wrongDirectoryId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_복원_삭제안된_디렉토리_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", directoryId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_복원_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", directoryId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH, DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_복원_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", directoryId)
                                .header(AUTH_HEADER, otherToken)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_복원_영구삭제_디렉토리_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_영구(token, directoryId, mockMvc);

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", directoryId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_복원_없는디렉토리_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        directoryTestUtil.파일_생성(token, directoryId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        Long wrongDirectoryId = 99999L;

        mockMvc.perform(
                        put("/directory/restore/{directoryId}", wrongDirectoryId)
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.restorePathFields));
    }

    @Test
    void 디렉토리_휴지통_조회_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long folderId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long fileId1 = directoryTestUtil.파일_생성(token, folderId, mockMvc);
        Long fileId2 = directoryTestUtil.파일_생성(token, folderId, mockMvc);
        Long fileId3 = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, folderId, mockMvc);
        directoryTestUtil.디렉토리_삭제_휴지통(token, fileId3, mockMvc);

        mockMvc.perform(
                get("/directory/trashbin")
                        .header(AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "휴지통에 있는 폴더/파일을 조회하는 API 입니다." +
                                "<br><br><b>header에 올바른 JWT accessToken</b>을 담아 <b>get 요청</b> 해주세요." +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 휴지통 디렉토리 정보</b>가 반환됩니다." +
                                "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다.",
                        "휴지통 폴더/파일 조회", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.getTrashbinResponseFields
                        ));
    }

    @Test
    void 디렉토리_휴지통_조회_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long folderId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);
        Long fileId1 = directoryTestUtil.파일_생성(token, folderId, mockMvc);
        Long fileId2 = directoryTestUtil.파일_생성(token, folderId, mockMvc);
        Long fileId3 = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        directoryTestUtil.디렉토리_삭제_휴지통(token, folderId, mockMvc);
        directoryTestUtil.디렉토리_삭제_휴지통(token, fileId3, mockMvc);

        mockMvc.perform(
                        get("/directory/trashbin")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH));
    }
}
