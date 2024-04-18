package com.ssafy.ododoc.common.type;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.http.HttpStatus;

public record ErrorResponse(
        String errorType,
        String message,
        String fieldName,

        @JsonIgnore
        HttpStatus status
) {
}
