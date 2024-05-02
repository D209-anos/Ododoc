package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class DirectoryAlreadyDeletedException extends CustomException {

    public DirectoryAlreadyDeletedException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
