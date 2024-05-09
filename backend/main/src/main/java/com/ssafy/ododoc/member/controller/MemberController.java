package com.ssafy.ododoc.member.controller;

import com.ssafy.ododoc.auth.config.JwtProvider;
import com.ssafy.ododoc.auth.response.JwtTokenResponse;
import com.ssafy.ododoc.auth.response.LoginResponse;
import com.ssafy.ododoc.directory.entity.Directory;
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
        log.info("login 실행 : {}", loginRequest);
        Directory directory = memberService.getMemberInfo(provider, loginRequest.getCode(), loginRequest.getUrl());

        jwtProvider.setRefreshTokenForClient(response, directory.getMember());
        return jwtProvider.makeLoginResponse(directory);
    }

    /**
     * IntelliJ Plugin 소셜 로그인
     *
     * @param code OAuth 인가코드
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * @return 로그인 한 회원의 JWT 정보, root Directory 정보
     */
    @GetMapping(value = "/authorization/{provider}", produces = "application/json; charset=UTF-8")
    public LoginResponse login(@RequestParam String code,
                               @RequestParam(required = false) String redirectUri,
                               @PathVariable String provider,
                               HttpServletResponse response) {

        log.debug("[테스트 social login 호출] : {} {}", provider, code);
        Directory directory = memberService.getMemberInfo(provider, code, redirectUri);

        jwtProvider.setRefreshTokenForClient(response, directory.getMember());
        return jwtProvider.makeLoginResponse(directory);
    }

    /**
     *  vscode extension 로그인
     *
     * @param code OAuth 인가코드
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * redirect => accesstoken을 uri에 담아서
     */
    @GetMapping("/authorization/vsc/{provider}")
    public void vscLogin(@RequestParam String code,
                         @PathVariable String provider,
                         HttpServletResponse response) throws IOException {

        log.debug("[vscode용 login 호출] : {} {}", provider, code);
        Directory directory = memberService.getMemberInfo(provider, code, "http://localhost:8080/api/oauth2/authorization/vsc/" + provider);

        LoginResponse loginResponse = jwtProvider.makeLoginResponse(directory);
        String vscodeUri = "vscode://anos.ododoc-vsc/callback?token=" + loginResponse.accessToken() + "&provider=" + loginResponse.oAuthProvider() +
                "&rootId=" + loginResponse.rootId() + "&title=" + loginResponse.title() + "&type=" + loginResponse.type();

        jwtProvider.setRefreshTokenForClient(response, directory.getMember());
        response.sendRedirect(vscodeUri);
    }

    /**
     *  Chrome extension 로그인
     *
     * @param code OAuth 인가코드
     * @param provider OAuth Provider (kakao, google, naver)
     * @param response 쿠키 저장을 위한 response
     * redirect => accesstoken을 uri에 담아서
     */
    @GetMapping("/authorization/chrome/{provider}")
    public void chromeLogin(@RequestParam String code,
                         @PathVariable String provider,
                         HttpServletResponse response) throws IOException {

        log.debug("[chrome extension login 호출] : {} {}", provider, code);
        Directory directory = memberService.getMemberInfo(provider, code, "https://k10d209.p.ssafy.io/api/oauth2/authorization/chrome/" + provider);
        LoginResponse loginResponse = jwtProvider.makeLoginResponse(directory);
        String chromeUri = "chrome-extension://cbdkicalcllkaeiijblihjfbkofmkaed/index.html?token=" + loginResponse.accessToken() + "&provider=" + loginResponse.oAuthProvider() +
                "&rootId=" + loginResponse.rootId() + "&title=" + loginResponse.title() + "&type=" + loginResponse.type();
        jwtProvider.setRefreshTokenForClient(response, directory.getMember());
        response.sendRedirect(chromeUri);
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
