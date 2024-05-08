package com.ssafy.ododoc.member.service;

import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import com.ssafy.ododoc.directory.repository.DirectoryClosureRepository;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.member.dto.OAuthMemberInfo;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import com.ssafy.ododoc.member.repository.MemberRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import com.ssafy.ododoc.member.util.GoogleOAuth2Utils;
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
    private final GoogleOAuth2Utils googleUtil;
    private final MemberRepository memberRepository;
    private final DirectoryRepository directoryRepository;
    private final DirectoryClosureRepository directoryClosureRepository;

    public Directory getMemberInfo(String inputProvider, String code, String redirectUri) {
        log.info("getMemberInfo 실행 : {} {} {}", inputProvider, code, redirectUri);
        OAuthProvider provider = OAuthProvider.getOAuthProvider(inputProvider);
        OAuthMemberInfo oAuthMemberInfo = getOAuthMemberInfo(provider, code, redirectUri);

        if(oAuthMemberInfo == null){
            throw new OAuthInfoNullException("존재하지않는 유저입니다.");
        }

        return directoryRepository.findRoot(oAuthMemberInfo, provider)
                .orElseGet(() -> createMemberAndDirectory(oAuthMemberInfo, provider));
    }

    public OAuthMemberInfo getOAuthMemberInfo(OAuthProvider provider, String code, String redirectUri) {
        return switch (provider){
            case KAKAO -> kakaoUtil.getUserInfo(code, redirectUri);
            case NAVER -> naverUtil.getUserInfo(code);
            case GOOGLE -> googleUtil.getUserInfo(code,redirectUri);
        };
    }

    private Directory createMemberAndDirectory(OAuthMemberInfo oAuthMemberInfo, OAuthProvider provider) {
        log.info("createMemberAndDirectory : {} {}", oAuthMemberInfo, provider);
        Member member = memberRepository.save(Member.builder()
                .code(oAuthMemberInfo.code())
                .provider(provider)
                .nickname(oAuthMemberInfo.nickname())
                .build());

        Directory root = directoryRepository.save(Directory.builder()
                .name(oAuthMemberInfo.nickname() + "님의 정리공간")
                .type(DirectoryType.FOLDER)
                .member(member)
                .build());

        directoryClosureRepository.save(DirectoryClosure.builder()
                .ancestor(root)
                .descendant(root)
                .build());

        return root;
    }
}
