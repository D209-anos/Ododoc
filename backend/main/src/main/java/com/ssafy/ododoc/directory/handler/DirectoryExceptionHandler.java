package com.ssafy.ododoc.directory.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import com.ssafy.ododoc.directory.exception.FileParentNullException;
import com.ssafy.ododoc.directory.exception.FolderAccessDeniedException;
import com.ssafy.ododoc.directory.exception.FolderGoneException;
import com.ssafy.ododoc.directory.exception.ParentNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import static com.ssafy.ododoc.common.handler.ExceptionHandlerTool.makeErrorResponse;

@RestControllerAdvice
public class DirectoryExceptionHandler {

    @ExceptionHandler(ParentNotFoundException.class)
    public List<ErrorResponse> parentNotFoundExceptionHandler(ParentNotFoundException e) {
        return makeErrorResponse(e, "parent");
    }

    @ExceptionHandler(FolderGoneException.class)
    public List<ErrorResponse> folderGoneExceptionHandler(FolderGoneException e) {
        return makeErrorResponse(e, "folder");
    }

    @ExceptionHandler(FolderAccessDeniedException.class)
    public List<ErrorResponse> folderAccessDeniedExceptionHandler(FolderAccessDeniedException e) {
        return makeErrorResponse(e, "folder");
    }

    @ExceptionHandler(FileParentNullException.class)
    public List<ErrorResponse> fileParentNullExceptionHandler(FileParentNullException e) {
        return makeErrorResponse(e, "parent");
    }
}
