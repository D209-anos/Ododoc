package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class CannotUploadImageException extends CustomException {

    public CannotUploadImageException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
