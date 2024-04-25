package com.ssafy.ododoc.member.dto.response;

import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleMemberInfoResponse implements OAuthMemberInfo {

    private String sub;
    private String name;

    @Override
    public String code() {
        return this.sub;
    }

    @Override
    public String nickname() {
        return this.name;
    }
}
