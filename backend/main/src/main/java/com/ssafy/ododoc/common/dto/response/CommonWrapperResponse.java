package com.ssafy.ododoc.common.dto.response;

import lombok.Builder;

@Builder
public record CommonWrapperResponse(
        Integer status,
        Object data
) {
}
