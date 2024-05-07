package com.ssafy.ododoc.member.controller;

import com.ssafy.ododoc.auth.config.JwtProvider;
import com.ssafy.ododoc.auth.response.JwtTokenResponse;
import com.ssafy.ododoc.auth.response.LoginResponse;
import com.ssafy.ododoc.member.dto.LoginDto;
import com.ssafy.ododoc.member.dto.request.LoginRequest;
import com.ssafy.ododoc.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * @author 이준희
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth2")
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final JwtProvider jwtProvider;

    /**
     * 소셜 로그인
     *
     * @param loginRequest  OAuth 인가 코드와 redirect_uri
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * @return 로그인 한 회원의 JWT 정보, root Directory 정보
     */
    @PostMapping(value = "/authorization/{provider}")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, @PathVariable String provider, HttpServletResponse response) {
        LoginDto loginDto = memberService.getMemberInfo(provider, loginRequest.getCode(), loginRequest.getUrl());

        jwtProvider.setRefreshTokenForClient(response, loginDto.getMember());
        return jwtProvider.makeLoginResponse(loginDto);
    }

    /**
     * IntelliJ Plugin 소셜 로그인
     *
     * @param code OAuth 인가코드
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * @return 로그인 한 회원의 JWT 정보, root Directory 정보
     */
    @GetMapping("/authorization/{provider}")
    public LoginResponse login(@RequestParam String code,
                               @RequestParam(required = false) String redirectUri,
                               @PathVariable String provider,
                               HttpServletResponse response) {

        log.debug("[테스트 social login 호출] : {} {}", provider, code);
        LoginDto loginDto = memberService.getMemberInfo(provider, code, redirectUri);

        jwtProvider.setRefreshTokenForClient(response, loginDto.getMember());
        return jwtProvider.makeLoginResponse(loginDto);
    }

    /**
     *  vscode extension 로그인
     * @param code OAuth 인가코드
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * redirect => accesstoken을 uri에 담아서
     */
    @GetMapping("/authorization/vsc/{provider}")
    public void vscLogin(@RequestParam String code,
                         @PathVariable String provider,
                         HttpServletResponse response) throws IOException {

        log.debug("[테스트 social login 호출] : {} {}", provider, code);
        LoginDto loginDto = memberService.getMemberInfo(provider, code, redirectUri);

        LoginResponse loginResponse = jwtProvider.makeLoginResponse(loginDto);
        String vscodeUri = "vscode://anos.ododoc-vsc/callback?token=" + loginResponse.accessToken() + "&provider=" + loginResponse.oAuthProvider();

        jwtProvider.setRefreshTokenForClient(response, loginDto.getMember());
        log.debug("[vscode용 login 호출] : {} {}", provider, code);
        Member memberInfo = memberService.getMemberInfo(provider, code, "http://localhost:8080/api/oauth2/authorization/vsc/" + provider);
        JwtTokenResponse jwtTokenResponse = jwtProvider.makeJwtTokenResponse(memberInfo);
        String vscodeUri = "vscode://anos.ododoc-vsc/callback?token=" + jwtTokenResponse.accessToken() + "&provider=" + jwtTokenResponse.oAuthProvider();
        jwtProvider.setRefreshTokenForClient(response, memberInfo);
        response.sendRedirect(vscodeUri);
    }

    /**
     * 로그아웃
     *
     * @param request
     * @param response 쿠키 삭제를 위한 response
     */
    @GetMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        jwtProvider.removeRefreshTokenForClient(request, response);
    }

    /**
     * 회원 액세스 토큰 재발급
     *
     * @param refreshToken 액세스 토큰 재발급을 위해, 자동으로 쿠키에 담겨져 들어오는 리프레시 토큰
     * @return 로그인 한 회원의 JWT 정보
     */
    @PostMapping("/issue/access-token")
    public JwtTokenResponse issueAccessToken(@CookieValue(name = "refreshToken", required = false) String refreshToken){
        return jwtProvider.reissueAccessToken(refreshToken);
    }
}
