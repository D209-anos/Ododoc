package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class FolderGoneException extends CustomException {

    public FolderGoneException(String message) {
        super(message, HttpStatus.GONE);
    }
}
