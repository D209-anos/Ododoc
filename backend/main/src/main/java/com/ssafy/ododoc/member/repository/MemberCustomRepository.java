package com.ssafy.ododoc.member.repository;

import com.ssafy.ododoc.member.dto.LoginDto;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.type.OAuthProvider;

import java.util.Optional;

public interface MemberCustomRepository {

    Optional<LoginDto> findMemberAndRoot(OAuthMemberInfo oAuthMemberInfo, OAuthProvider provider);
}
