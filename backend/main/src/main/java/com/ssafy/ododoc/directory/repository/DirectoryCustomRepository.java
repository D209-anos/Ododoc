package com.ssafy.ododoc.directory.repository;

import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.type.OAuthProvider;

import java.util.Optional;

public interface DirectoryCustomRepository {

    Optional<Directory> findRoot(OAuthMemberInfo oAuthMemberInfo, OAuthProvider provider);
}
