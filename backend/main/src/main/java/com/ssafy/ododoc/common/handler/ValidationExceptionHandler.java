package com.ssafy.ododoc.common.handler;

import com.ssafy.ododoc.common.type.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.List;

@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.OK)
    public List<ErrorResponse>  processValidationExceptionHandler(BindException e) {
        return e.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> ErrorResponse.builder()
                        .message(fieldError.getDefaultMessage())
                        .errorType(fieldError.getCode())
                        .fieldName(fieldError.getField())
                        .status(HttpStatus.BAD_REQUEST)
                        .build())
                .toList();
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public List<ErrorResponse> constraintViolationExceptionHandler(ConstraintViolationException e) {
        return e.getConstraintViolations().stream()
                .map(error ->{
                    String[] propertyPath = error.getPropertyPath().toString().split("\\.");
                    String fieldName = propertyPath[propertyPath.length - 1];

                    return ErrorResponse.builder()
                            .message(e.getMessage().split(": ")[1])
                            .errorType(e.getClass().getSimpleName())
                            .fieldName(fieldName)
                            .status(HttpStatus.BAD_REQUEST)
                            .build();
                })
                .toList();
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public List<ErrorResponse> missingServletRequestPartExceptionHandler(MissingServletRequestPartException e) {
        return List.of(ErrorResponse.builder()
                .message(e.getMessage())
                .errorType(e.getClass().getSimpleName())
                .fieldName(e.getRequestPartName())
                .status(HttpStatus.BAD_REQUEST)
                .build());
    }
}
