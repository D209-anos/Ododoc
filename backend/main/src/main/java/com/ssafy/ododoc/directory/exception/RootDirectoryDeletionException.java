package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class RootDirectoryDeletionException extends CustomException {

    public RootDirectoryDeletionException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
