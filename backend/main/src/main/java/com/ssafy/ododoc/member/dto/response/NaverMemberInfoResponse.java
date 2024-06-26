package com.ssafy.ododoc.member.dto.response;

import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import lombok.Getter;

import java.util.Map;

@Getter
public class NaverMemberInfoResponse implements OAuthMemberInfo {

    private Map<String, Object> response;

    @Override
    public String code() {
        return response.get("id").toString();
    }

    @Override
    public String nickname() {
        return response.get("nickname").toString();
    }
}
