package com.ssafy.ododoc.member.service;

import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import com.ssafy.ododoc.member.repository.MemberRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String[] split = username.split(":");

        OAuthProvider provider = OAuthProvider.getOAuthProvider(split[0]);
        String code = split[1];

        return memberRepository.findByCodeAndProvider(code, provider)
                .orElseThrow(()-> new OAuthInfoNullException("해당하는 회원이 없습니다."));
    }
}
