package com.ssafy.ododoc.member.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Map;

@Getter
@Setter
public class KakaoMemberfInfoResponse implements OAuthMemberInfo {

    private Long id;
    private Timestamp connecetedAt;

    @JsonProperty("kakao_account")
    private Map<String, Object> kakaoAccount;
    private Map<String, Object> profile;

    @Override
    public String code() {
        return id.toString();
    }

    @Override
    public String nickname() {
        profile = (Map<String, Object>)kakaoAccount.get("profile");
        return profile.get("nickname").toString();
    }
}
