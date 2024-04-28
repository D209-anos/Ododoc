package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class DirectoryGoneException extends CustomException {

    public DirectoryGoneException(String message) {
        super(message, HttpStatus.GONE);
    }
}
