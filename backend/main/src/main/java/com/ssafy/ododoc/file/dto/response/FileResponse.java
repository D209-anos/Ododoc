package com.ssafy.ododoc.file.dto.response;

import com.ssafy.ododoc.file.dto.Block;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Builder
@Getter
public class FileResponse {

    private Long directoryId;
    private String title;
    private Map<String, Block> content;
}
