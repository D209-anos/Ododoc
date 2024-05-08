package com.ssafy.ododoc.directory.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.type.OAuthProvider;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import static com.ssafy.ododoc.directory.entity.QDirectory.directory;

@RequiredArgsConstructor
public class DirectoryCustomRepositoryImpl implements DirectoryCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<Directory> findRoot(OAuthMemberInfo oAuthMemberInfo, OAuthProvider provider) {
        return Optional.ofNullable(
                jpaQueryFactory.selectFrom(directory)
                        .where(directory.member.code.eq(oAuthMemberInfo.code())
                                .and(directory.member.provider.eq(provider))
                                .and(directory.parent.isNull()))
                        .fetchOne());
    }
}
