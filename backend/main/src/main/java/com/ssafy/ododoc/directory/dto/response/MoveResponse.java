package com.ssafy.ododoc.directory.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MoveResponse {

    private Long id;
    private Long newParentId;
}
