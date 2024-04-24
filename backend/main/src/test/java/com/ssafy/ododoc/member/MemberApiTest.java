package com.ssafy.ododoc.member;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.CommonDocument;
import com.ssafy.ododoc.common.MemberTestUtil;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.repository.MemberRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class MemberApiTest extends ApiTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberSteps memberSteps;

    @Autowired
    private MemberTestUtil memberTestUtil;

    @Test
    void 로그인_성공_200() throws Exception {
        memberRepository.save(Member.builder()
                .code(MemberTestUtil.memberCode)
                .provider(OAuthProvider.GOOGLE)
                .nickname(MemberTestUtil.memberNickName)
                .title(MemberTestUtil.memberNickName + "님의 정리공간")
                .build());

        mockMvc.perform(
                post("/oauth2/authorization/{provider}", "google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberSteps.로그인_생성(MemberTestUtil.memberCode)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(cookie().exists("refreshToken"))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "소셜 로그인 처리 API 입니다." +
                        "<br><br><b>소셜 로그인에서 받아온 정상적인 code와 타겟으로 하는 provider, 현재 처리하고 있는 redirect url</b>을" +
                        "<br>request body에 담아 post 요청 해주세요." +
                        "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 JWT Access Token 관련 정보들</b>이 반환됩니다." +
                        "<br> - 추가로 <b>refresh token이 cookie에 반환</b>됩니다." +
                        "<br> - <b>유효하지 않은 code나 redirect url</b>을 입력 시, <b>403 Forbidden</b>이 반환됩니다." +
                        "<br> - <b>올바른 code와 redirect url</b>을 입력했지만, 사용자의 정보를 불러오는 데 실패했다면 <b>404 Not Found</b>가 반환됩니다." +
                        "<br> - <b>google, naver, kakao</b> 이외 다른 provider 입력 시, <b>406 Not Acceptable</b>이 반환됩니다.",
                        "소셜 로그인", MemberDocument.providerPathField,
                        MemberDocument.loginRequestField,
                        MemberDocument.loginResultResponseField));

    }

    @Test
    void 로그인_유효하지않음_403() throws Exception {
        mockMvc.perform(
                post("/oauth2/authorization/{provider}", "kakao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberSteps.로그인_생성("123456")))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, MemberDocument.providerPathField,
                        MemberDocument.loginRequestField));
    }

    @Test
    void 로그인_없는유저_404() throws Exception {
        mockMvc.perform(
                        post("/oauth2/authorization/{provider}", "google")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(memberSteps.로그인_생성("123456")))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, MemberDocument.providerPathField,
                        MemberDocument.loginRequestField));
    }

    @Test
    void 로그인_잘못된_플랫폼_406() throws Exception {
        mockMvc.perform(
                        post("/oauth2/authorization/{provider}", "ssafy")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(memberSteps.로그인_생성(MemberTestUtil.memberCode)))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(406))
                .andDo(document(DEFAULT_RESTDOC_PATH, MemberDocument.providerPathField,
                        MemberDocument.loginRequestField));
    }

    @Test
    void 로그아웃_성공_200() throws Exception {
        String accessToken = memberTestUtil.회원가입_토큰반환(mockMvc);
        mockMvc.perform(
                get("/oauth2/logout")
                        .header(AUTH_HEADER, accessToken)

        )
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("refreshToken",0))
                .andDo(document(DEFAULT_RESTDOC_PATH, "소셜 로그아웃 처리 API 입니다." +
                                "<br><br><b>request header에 accessToken을 담아 Get 요청을 해주세요.<b>" +
                                "<br> - 정상 처리 시 cookie에 있는 maxAge가 0이 되어 refreshToken이 삭제됩니다.",
                        "소셜 로그아웃", CommonDocument.AccessTokenHeader));

    }

    @Test
    void 액세스_토큰_재발급_성공_200() throws Exception {
        Cookie cookie = memberTestUtil.회원가입_쿠키반환(mockMvc);
        mockMvc.perform(
                post("/oauth2/issue/access-token")
                        .cookie(cookie)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(document(DEFAULT_RESTDOC_PATH,"만료된 액세스 토큰 재발급 API 입니다." +
                                "<br><br><b>refresh token가 담겨 있는 cookie를 post 요청해주세요.<b>" +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 access Token 정보가</b>이 반환됩니다." +
                                "<br> - <b>유효하지 않은 refresh token 전달 시, <b>401 UnAuthorized</b>가 반환됩니다.",
                        "액세스 토큰 재발급", MemberDocument.refreshTokenCookieRequestField,
                        MemberDocument.loginResultResponseField));
    }

    @Test
    void 액세스_토큰_토큰없음_401() throws Exception {
        mockMvc.perform(
                post("/oauth2/issue/access-token")
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH));
    }
}
