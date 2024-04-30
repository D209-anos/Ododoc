package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class DirectoryAccessDeniedException extends CustomException {

    public DirectoryAccessDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
