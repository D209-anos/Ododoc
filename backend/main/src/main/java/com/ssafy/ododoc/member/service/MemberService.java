package com.ssafy.ododoc.member.service;

import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import com.ssafy.ododoc.member.repository.MemberRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import com.ssafy.ododoc.member.util.KakaoOAuth2Utils;
import com.ssafy.ododoc.member.util.NaverOAuth2Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final KakaoOAuth2Utils kakaoUtil;
    private final NaverOAuth2Utils naverUtil;
    private final MemberRepository memberRepository;

    public Member getMemberInfo(String inputProvider, String code, String redirectUri) {
        OAuthProvider provider = OAuthProvider.getOAuthProvider(inputProvider);
        OAuthMemberInfo oAuthMemberInfo = getOAuthMemberInfo(provider, code, redirectUri);

        if(oAuthMemberInfo == null){
            throw  new OAuthInfoNullException("존재하지않는 유저입니다.");
        }

        String storageName = oAuthMemberInfo.nickname() + "님의 정리공간";
        return memberRepository.findByCodeAndProvider(oAuthMemberInfo.code(), provider)
                .orElseGet(() -> memberRepository.save(Member.builder()
                        .code(oAuthMemberInfo.code())
                        .provider(provider)
                        .nickname(oAuthMemberInfo.nickname())
                        .title(storageName)
                        .build()));
    }

    public OAuthMemberInfo getOAuthMemberInfo(OAuthProvider provider, String code, String redirectUrl) {
        return switch (provider){
            case KAKAO -> kakaoUtil.getUserInfo(code, redirectUrl);
            case NAVER -> naverUtil.getUserInfo(code, redirectUrl);
            case GOOGLE -> null;
        };
    }
}
