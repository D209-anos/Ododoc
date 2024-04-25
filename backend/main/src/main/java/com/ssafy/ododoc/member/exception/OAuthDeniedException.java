package com.ssafy.ododoc.member.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class OAuthDeniedException extends CustomException {

    public OAuthDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
