package com.ssafy.ododoc.directory;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.CommonDocument;
import com.ssafy.ododoc.common.MemberTestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DirectoryApiTest extends ApiTest {

    @Autowired
    private MemberTestUtil memberTestUtil;

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
}
