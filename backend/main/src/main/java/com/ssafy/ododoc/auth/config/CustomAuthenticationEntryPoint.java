package com.ssafy.ododoc.auth.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.auth.type.JwtCode;
import com.ssafy.ododoc.common.dto.response.CommonWrapperResponse;
import com.ssafy.ododoc.common.type.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        String token = jwtProvider.resolveToken(request);
        JwtCode jwtCode = jwtProvider.validateToken(token);

        response.setContentType("application/json;charset=UTF-8");

        CommonWrapperResponse errorMsg = getErrorMessageMap(jwtCode);
        response.getWriter().write(objectMapper.writeValueAsString(errorMsg));
    }

    private static CommonWrapperResponse getErrorMessageMap(JwtCode jwtCode){

        ErrorResponse errorResponse = switch (jwtCode){
            case DENIED -> errorResponseBuilder("AccessDeniedException", "권한이 없습니다.");
            case EXPIRED -> errorResponseBuilder("TokenExpireException","토큰이 만료되었습니다.");
            case INVALID -> errorResponseBuilder("TokenInvalidException", "토큰이 유효하지 않습니다.");
        };

        return CommonWrapperResponse.builder()
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .data(errorResponse)
                .build();
    }

    private static ErrorResponse errorResponseBuilder(String errorType, String errorMessage) {
        return ErrorResponse.builder()
                .errorType(errorType)
                .message(errorMessage)
                .fieldName("")
                .build();
    }
}
