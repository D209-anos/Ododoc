package com.ssafy.ododoc.file.dto.request;

import com.ssafy.ododoc.file.dto.Block;
import com.ssafy.ododoc.file.dto.annotation.CheckFileType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.LinkedHashMap;

@Builder
@Getter
public class AddRequest {

    @NotNull(message = "directory 아이디는 null 일 수 없습니다.")
    @Min(value = 1, message = "directory 아이디는 1 이상이어야 합니다.")
    private Long connectedFileId;

    @CheckFileType
    private String type;

    private Integer visitedCount;
    private LinkedHashMap<String, Block> fileBlock;
}
