package com.ssafy.ododoc.member.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import com.ssafy.ododoc.member.exception.OAuthDeniedException;
import com.ssafy.ododoc.member.exception.OAuthInfoNullException;
import com.ssafy.ododoc.member.exception.ProviderNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.ododoc.common.handler.ExceptionHandlerTool.makeErrorResponse;

import java.util.List;


@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(OAuthDeniedException.class)
    public List<ErrorResponse> oAuthDeniedExceptionHandler(OAuthDeniedException e) {
        return makeErrorResponse(e, "invalid");
    }

    @ExceptionHandler(OAuthInfoNullException.class)
    public List<ErrorResponse> oAuthInfoNullException(OAuthInfoNullException e) {
        return makeErrorResponse(e, "null");
    }

    @ExceptionHandler(ProviderNotSupportedException.class)
    public List<ErrorResponse> providerNotSupportedException(ProviderNotSupportedException e){
        return makeErrorResponse(e, "invalid");
    }

}
