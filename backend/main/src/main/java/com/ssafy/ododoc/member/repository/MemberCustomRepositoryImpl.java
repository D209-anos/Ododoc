package com.ssafy.ododoc.member.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.member.dto.LoginDto;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.type.OAuthProvider;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import static com.ssafy.ododoc.directory.entity.QDirectory.directory;
import static com.ssafy.ododoc.member.entity.QMember.member;

@RequiredArgsConstructor
public class MemberCustomRepositoryImpl implements MemberCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<LoginDto> findMemberAndRoot(OAuthMemberInfo oAuthMemberInfo, OAuthProvider provider) {
        return Optional.ofNullable(
                jpaQueryFactory.select(
                        Projections.fields(LoginDto.class,
                                member,
                                directory)
                        )
                        .from(member).leftJoin(directory)
                        .on(member.id.eq(directory.member.id))
                        .where(member.code.eq(oAuthMemberInfo.code())
                                .and(member.provider.eq(provider))
                                .and(directory.parent.isNull()))
                        .fetchOne());
    }
}
