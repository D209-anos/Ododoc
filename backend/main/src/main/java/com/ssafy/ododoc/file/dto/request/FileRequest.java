package com.ssafy.ododoc.file.dto.request;

import com.ssafy.ododoc.file.dto.Block;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.LinkedHashMap;

@Builder
@Getter
public class FileRequest {

    @NotNull(message = "directory 아이디는 null 일 수 없습니다.")
    @Min(value = 1, message = "directory 아이디는 1 이상이어야 합니다.")
    private Long directoryId;

    @NotNull(message = "content는 null일 수 없습니다. 비어있다면 빈 객체를 보내주세요.")
    private LinkedHashMap<String, Block> content;
}
