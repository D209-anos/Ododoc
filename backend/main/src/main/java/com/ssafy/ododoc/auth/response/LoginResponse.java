package com.ssafy.ododoc.auth.response;

import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.member.type.OAuthProvider;
import lombok.Builder;

@Builder
public record LoginResponse(
        String accessToken,
        String tokenType,
        OAuthProvider oAuthProvider,
        Long rootId,
        String title,
        DirectoryType type
) {
}
