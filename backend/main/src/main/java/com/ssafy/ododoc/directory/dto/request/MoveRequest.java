package com.ssafy.ododoc.directory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MoveRequest {

    @NotNull
    @Min(value = 1, message = "Directory ID는 1 이상이어야 합니다.")
    private Long id;

    @NotNull
    @Min(value = 1, message = "Parent ID는 1 이상이어야 합니다.")
    private Long parentId;
}
