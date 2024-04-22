package com.ssafy.ododoc.common.exception;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException{
    protected HttpStatus status;

    public CustomException(String message, HttpStatus status){
        super(message);
        this.status = status;
    }
}
