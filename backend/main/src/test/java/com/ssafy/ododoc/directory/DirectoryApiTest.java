package com.ssafy.ododoc.directory;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.CommonDocument;
import com.ssafy.ododoc.common.MemberTestUtil;
import com.ssafy.ododoc.directory.util.DirectoryTestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
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
    void 디렉토리_폴더생성_성공_상위없음_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성_이름_상위_없음()))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "디렉토리(폴더/파일)를 생성하는 API 입니다." +
                        "<br><br><b>header에 올바른 JWT accessToken</b>을, <b>body에 올바른 request</b>를 담아 <b>post 요청</b> 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 생성된 폴더/파일 정보들</b>이 반환됩니다." +
                        "<br> - 폴더/파일명이 없을 경우에는 <b>빈 문자열</b>을 보내주세요. 그렇지 않으면 <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - 폴더인데 상위 폴더가 없을 경우에는 <b>null</b>을 보내주세요." +
                        "<br> - 파일은 상위 폴더가 <b>필수</b>입니다. <b>파일인데 상위 폴더 아이디가 null인 경우</b>, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - type에 <b>FOLDER 또는 FILE</b>이 아닌 값을 입력하면, <b>400 Bad Request</b>가 반환됩니다." +
                        "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더에 접근 권한이 없을 경우, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더를 찾을 수 없을 경우, <b>404 Not Found</b>가 반환됩니다." +
                        "<br> - parentId에 해당하는 폴더가 이미 삭제(휴지통, 영구삭제) 되었다면, <b>410 Gone</b>이 반환됩니다.",
                        "디렉토리(폴더/파일) 생성", CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields, DirectoryDocument.createResponseFields
                        ));
    }

    @Test
    void 디렉토리_폴더생성_성공_이름_상위있음_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, mockMvc);

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성_이름_상위_있음(parentId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields, DirectoryDocument.createResponseFields
                ));
    }

    @Test
    void 디렉토리_파일생성_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, mockMvc);

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

        mockMvc.perform(
                post("/directory")
                        .header(AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성_이름_30자이상()))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        DirectoryDocument.createRequestFields));

    }

    @Test
    void 디렉토리_파일생성_이름null_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, mockMvc);

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
        Long parentId = directoryTestUtil.폴더_생성(token, mockMvc);

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
    void 디렉토리_생성_토큰없음_401() throws Exception {
        mockMvc.perform(
                post("/directory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성_이름_상위_없음()))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH,
                        DirectoryDocument.createRequestFields));
    }

    @Test
    void 디렉토리_생성_상위폴더_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long parentId = directoryTestUtil.폴더_생성(token, mockMvc);

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
        Long parentId = -1L;

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
    void 디렉토리_생성_삭제된상위폴더_410() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);

        // TODO : 삭제 api 구현 후 테스트 코드 작성
    }
}
