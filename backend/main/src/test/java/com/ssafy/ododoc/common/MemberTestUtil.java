package com.ssafy.ododoc.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.member.MemberSteps;
import com.ssafy.ododoc.member.dto.response.GoogleMemberInfoResponse;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.repository.MemberRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Component
public class MemberTestUtil extends TestBase {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberSteps memberSteps;

    public static String memberCode = "3450180654";
    public static String memberNickName = "아노쓰";
    public static String otherMemberCode = "3449714270";
    public static String otherMemberNickName = "다른닉네임";
    public static String googleRedirectUrl = "http://localhost:8080/api/oauth2/authorization/google";

    public String 회원가입_토큰반환(MockMvc mockMvc) throws Exception {
        MvcResult mvcResult = 회원가입_및_로그인(mockMvc, memberCode);
        return getValueFromJSONBody(mvcResult, "$.data.accessToken", "");
    }

    public String 회원가입_다른유저_토큰반환(MockMvc mockMvc) throws Exception {
        MvcResult mvcResult = 회원가입_및_로그인(mockMvc, otherMemberCode);
        return getValueFromJSONBody(mvcResult, "$.data.accessToken", "");
    }

    public Cookie 회원가입_쿠키반환(MockMvc mockMvc) throws Exception {
        MvcResult mvcResult = 회원가입_및_로그인(mockMvc, memberCode);
        return mvcResult.getResponse().getCookie("refreshToken");
    }

    private MvcResult 회원가입_및_로그인(MockMvc mockMvc, String code) throws Exception {
        memberRepository.save(Member.builder()
                .code(memberCode)
                .provider(OAuthProvider.GOOGLE)
                .nickname(memberNickName)
                .title(memberNickName + "님의 정리공간")
                .build());

        return mockMvc.perform(
                post("/oauth2/authorization/{provider}", "google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberSteps.로그인_생성(code)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn();
    }

    public static GoogleMemberInfoResponse mockOauthInfo(String code, String nickname) {
        GoogleMemberInfoResponse response = new GoogleMemberInfoResponse();
        response.setSub(code);
        response.setName(nickname);
        return response;
    }
}
