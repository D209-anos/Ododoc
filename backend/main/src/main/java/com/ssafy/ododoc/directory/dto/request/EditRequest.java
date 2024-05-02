package com.ssafy.ododoc.directory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class EditRequest {

    @NotNull
    @Min(value = 1, message = "Directory ID는 1 이상이어야 합니다.")
    private Long id;

    @NotBlank(message = "name은 비어있을 수 없습니다.")
    private String name;
}
