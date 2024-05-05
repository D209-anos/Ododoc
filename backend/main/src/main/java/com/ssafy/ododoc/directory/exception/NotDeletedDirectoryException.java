package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class NotDeletedDirectoryException extends CustomException {

    public NotDeletedDirectoryException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
