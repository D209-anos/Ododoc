package com.ssafy.ododoc.file.dto.response;

import com.ssafy.ododoc.file.dto.Block;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class FileResponse {

    private Long directoryId;
    private String title;
    private List<Block> content;
}
