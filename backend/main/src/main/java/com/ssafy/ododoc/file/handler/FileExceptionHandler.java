package com.ssafy.ododoc.file.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import com.ssafy.ododoc.file.exception.FileBadRequestException;
import com.ssafy.ododoc.file.exception.NotAllowedImageException;
import com.ssafy.ododoc.file.exception.VisitCountNotNullException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import static com.ssafy.ododoc.common.handler.ExceptionHandlerTool.makeErrorResponse;

@RestControllerAdvice
public class FileExceptionHandler {

    @ExceptionHandler(NotAllowedImageException.class)
    public List<ErrorResponse> notAllowedImageExceptionHandler(NotAllowedImageException e) {
        return makeErrorResponse(e, "image");
    }

    @ExceptionHandler(FileBadRequestException.class)
    public List<ErrorResponse> fileBadRequestExceptionHandler(FileBadRequestException e) {
        return makeErrorResponse(e, "file");
    }

    @ExceptionHandler(VisitCountNotNullException.class)
    public List<ErrorResponse> visitCountNotNullExceptionHandler(VisitCountNotNullException e) {
        return makeErrorResponse(e, "visitCount");
    }
}
