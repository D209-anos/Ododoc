package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class DirectoryNotFoundException extends CustomException {

    public DirectoryNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
