package com.ssafy.ododoc.directory.exception;

import com.ssafy.ododoc.common.exception.CustomException;
import org.springframework.http.HttpStatus;

public class FolderAccessDeniedException extends CustomException {

    public FolderAccessDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
