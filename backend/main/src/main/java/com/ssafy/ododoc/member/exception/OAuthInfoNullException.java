package com.ssafy.ododoc.member.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class OAuthInfoNullException extends CustomException {

    public OAuthInfoNullException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
