package com.ssafy.ododoc.auth.response;

import com.ssafy.ododoc.member.type.OAuthProvider;
import lombok.Builder;

@Builder
public record JwtTokenResponse(
        String accessToken,
        String tokenType,
        OAuthProvider oAuthProvider
) {
}
