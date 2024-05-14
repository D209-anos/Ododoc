package com.ssafy.ododoc.file.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class VisitCountNotNullException extends CustomException {

    public VisitCountNotNullException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
