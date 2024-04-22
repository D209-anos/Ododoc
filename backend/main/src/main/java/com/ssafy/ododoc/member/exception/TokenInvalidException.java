package com.ssafy.ododoc.member.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class TokenInvalidException extends CustomException {

    public TokenInvalidException(String message){
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
