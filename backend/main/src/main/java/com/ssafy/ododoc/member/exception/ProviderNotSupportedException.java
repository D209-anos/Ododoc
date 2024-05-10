package com.ssafy.ododoc.member.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class ProviderNotSupportedException extends CustomException {

    public ProviderNotSupportedException(String message) {
        super(message, HttpStatus.NOT_ACCEPTABLE);
    }
}
