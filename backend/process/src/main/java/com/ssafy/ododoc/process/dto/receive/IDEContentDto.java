package com.ssafy.ododoc.process.dto.receive;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class IDEContentDto {

    private String details;
    private List<ModifiedFileDto> modifiedFiles;

}
