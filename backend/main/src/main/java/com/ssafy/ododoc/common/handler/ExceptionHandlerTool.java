package com.ssafy.ododoc.common.handler;

import com.ssafy.ododoc.common.exception.CustomException;
import com.ssafy.ododoc.common.type.ErrorResponse;

import java.util.List;

public class ExceptionHandlerTool {

    public static List<ErrorResponse> makeErrorResponse(CustomException e, String fieldName) {
        return List.of(ErrorResponse.builder()
                        .message(e.getMessage())
                        .errorType(e.getClass().getSimpleName())
                        .fieldName(fieldName)
                        .status(e.getStatus())
                        .build());
    }
}
