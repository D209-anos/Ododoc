package com.ssafy.ododoc.member.repository;

import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.type.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Optional<Member> findByCodeAndProvider(String code, OAuthProvider oAuthProvider);
}
