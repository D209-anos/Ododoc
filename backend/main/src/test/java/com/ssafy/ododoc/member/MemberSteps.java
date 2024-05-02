package com.ssafy.ododoc.member;

import com.ssafy.ododoc.common.MemberTestUtil;
import com.ssafy.ododoc.member.dto.request.LoginRequest;
import org.springframework.stereotype.Component;

@Component
public class MemberSteps {

    public LoginRequest 로그인_생성(String code) {
        return LoginRequest.builder()
                .code(code)
                .url(MemberTestUtil.googleRedirectUrl)
                .build();
    }
}
