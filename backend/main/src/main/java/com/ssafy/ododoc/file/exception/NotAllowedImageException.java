package com.ssafy.ododoc.file.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class NotAllowedImageException extends CustomException {

    public NotAllowedImageException(String message) {
        super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
}
