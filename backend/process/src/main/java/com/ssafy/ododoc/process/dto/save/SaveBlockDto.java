package com.ssafy.ododoc.process.dto.save;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class SaveBlockDto {

    private String accessToken;
    private long connectedFileId;
    private List<FileBlockDto> fileBlocks;

}
