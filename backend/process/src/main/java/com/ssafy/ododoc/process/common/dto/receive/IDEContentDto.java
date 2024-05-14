package com.ssafy.ododoc.process.common.dto.receive;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class IDEContentDto {

    private String details;
    private List<ModifiedFileDto> modifiedFiles;

}
