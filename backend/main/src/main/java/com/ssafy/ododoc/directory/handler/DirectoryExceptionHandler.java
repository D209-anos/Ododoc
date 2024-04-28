package com.ssafy.ododoc.directory.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import com.ssafy.ododoc.directory.exception.FileParentNullException;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryGoneException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
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

    @ExceptionHandler(DirectoryGoneException.class)
    public List<ErrorResponse> folderGoneExceptionHandler(DirectoryGoneException e) {
        return makeErrorResponse(e, "folder");
    }

    @ExceptionHandler(DirectoryAccessDeniedException.class)
    public List<ErrorResponse> directoryAccessDeniedExceptionHandler(DirectoryAccessDeniedException e) {
        return makeErrorResponse(e, "directory");
    }

    @ExceptionHandler(FileParentNullException.class)
    public List<ErrorResponse> fileParentNullExceptionHandler(FileParentNullException e) {
        return makeErrorResponse(e, "parent");
    }
}
