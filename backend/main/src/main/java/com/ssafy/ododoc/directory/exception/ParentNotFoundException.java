package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class ParentNotFoundException extends CustomException {

    public ParentNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
