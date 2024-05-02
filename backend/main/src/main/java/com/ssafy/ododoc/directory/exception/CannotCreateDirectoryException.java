package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class CannotCreateDirectoryException extends CustomException {

    public CannotCreateDirectoryException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
