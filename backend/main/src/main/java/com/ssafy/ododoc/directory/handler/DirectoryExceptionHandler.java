package com.ssafy.ododoc.directory.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import com.ssafy.ododoc.directory.exception.*;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import static com.ssafy.ododoc.common.handler.ExceptionHandlerTool.makeErrorResponse;

@RestControllerAdvice
public class DirectoryExceptionHandler {

    @ExceptionHandler(DirectoryNotFoundException.class)
    public List<ErrorResponse> directoryNotFoundExceptionHandler(DirectoryNotFoundException e) {
        return makeErrorResponse(e, "directory");
    }

    @ExceptionHandler(DirectoryAlreadyDeletedException.class)
    public List<ErrorResponse> directoryAlreadyDeletedExceptionHandler(DirectoryAlreadyDeletedException e) {
        return makeErrorResponse(e, "directory");
    }

    @ExceptionHandler(DirectoryAccessDeniedException.class)
    public List<ErrorResponse> directoryAccessDeniedExceptionHandler(DirectoryAccessDeniedException e) {
        return makeErrorResponse(e, "directory");
    }

    @ExceptionHandler(RootDirectoryDeletionException.class)
    public List<ErrorResponse> rootDirectoryDeletionExceptionHandler(RootDirectoryDeletionException e) {
        return makeErrorResponse(e, "directory");
    }
}
