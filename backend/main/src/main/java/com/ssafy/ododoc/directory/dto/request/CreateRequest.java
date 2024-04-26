package com.ssafy.ododoc.directory.dto.request;

import com.ssafy.ododoc.directory.dto.annotation.CheckDirectory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class CreateRequest {

    private Long parentId;

    @NotNull(message = "폴더/파일 명 입력은 필수입니다. 입력된 값이 없다면 빈 문자열을 보내주세요.")
    @Size(max = 30, message = "폴더/파일 명은 30자 이내여야 합니다.")
    private String name;

    @NotNull(message = "Type 입력은 필수입니다.")
    @CheckDirectory
    private String type;
}
