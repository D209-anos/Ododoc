package com.ssafy.ododoc.auth.config;

import com.ssafy.ododoc.auth.response.JwtTokenResponse;
import com.ssafy.ododoc.auth.response.LoginResponse;
import com.ssafy.ododoc.auth.type.JwtCode;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.entity.RefreshToken;
import com.ssafy.ododoc.member.exception.TokenInvalidException;
import com.ssafy.ododoc.member.repository.RefreshTokenRedisRepository;
import com.ssafy.ododoc.member.type.OAuthProvider;
import com.ssafy.ododoc.member.type.Role;
import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtProvider {

    private final UserDetailsService userDetailsService;
    private final RefreshTokenRedisRepository redisRepository;

    @Value("${jwt.secret.key}")
    private String secretKey;

    public static long tokenValidTime = 3 * 60 * 60 * 1000L;    // 3시간
    public static long refreshTokenValidTime = 15 * 60 * 60 * 24 * 1000L;   // 15일
    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }

    public JwtCode validateToken(String token) {
        if(token == null) {
            log.debug("JWT token이 null 입니다.");
            return JwtCode.INVALID;
        }

        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return JwtCode.DENIED;
        } catch (ExpiredJwtException e) {
            log.debug("만료된 JWT 토큰입니다.");
            return JwtCode.EXPIRED;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("잘못된 JWT 토큰입니다.");
        }

        return JwtCode.INVALID;
    }

    private String makeRefreshToken(String code, OAuthProvider oAuthProvider) {
        Claims claims = Jwts.claims().setSubject(code);
        claims.put("provider", oAuthProvider.toString());

        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshTokenValidTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    private String makeAccessToken(String code, Set<Role> roles, OAuthProvider oAuthProvider, String nickname) {
        Claims claims = Jwts.claims().setSubject(code);
        claims.put("roles", roles);
        claims.put("provider", oAuthProvider.toString());
        claims.put("nickname", nickname);

        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + tokenValidTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserInfoClaim(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    private String getUserInfoClaim(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("provider") + ":" + claims.getSubject();
    }

    public void setRefreshTokenForClient(HttpServletResponse response, Member member) {
        String refreshToken = makeRefreshToken(member.getCode(), member.getProvider());

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge((int) (refreshTokenValidTime / 1000));
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");

        redisRepository.save(RefreshToken.builder()
                .id(member.getId())
                .refreshToken(refreshToken)
                .build());

        response.addCookie(cookie);
    }

    public void removeRefreshTokenForClient(HttpServletRequest request, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", null)
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .build();

        if(request.getCookies() != null && request.getCookies().length != 0) {
            Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals("refreshToken"))
                    .findFirst().flatMap(c -> redisRepository.findByRefreshToken(c.getValue()))
                    .ifPresent(redisRepository::delete);
        }

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public JwtTokenResponse makeJwtTokenResponse(Member member) {
        String accessToken = makeAccessToken(member.getCode(), member.getRoles(), member.getProvider(), member.getNickname());

        return JwtTokenResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .oAuthProvider(member.getProvider())
                .build();
    }

    public LoginResponse makeLoginResponse(Directory directory) {
        String accessToken = makeAccessToken(directory.getMember().getCode(), directory.getMember().getRoles(), directory.getMember().getProvider(), directory.getMember().getNickname());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .oAuthProvider(directory.getMember().getProvider())
                .rootId(directory.getId())
                .title(directory.getName())
                .type(directory.getType())
                .build();
    }

    public JwtTokenResponse reissueAccessToken(String refreshToken) {
        if(isNotValidRefreshToken(refreshToken)) {
            throw new TokenInvalidException("refresh token 이 유효하지 않습니다.");
        }

        Member foundMember = (Member) userDetailsService.loadUserByUsername(getUserInfoClaim(refreshToken));
        return makeJwtTokenResponse(foundMember);
    }

    private boolean isNotValidRefreshToken(String refreshToken) {
        return refreshToken == null
                || redisRepository.findByRefreshToken(refreshToken).isEmpty()
                || validateToken(refreshToken) != JwtCode.DENIED;
    }
}
