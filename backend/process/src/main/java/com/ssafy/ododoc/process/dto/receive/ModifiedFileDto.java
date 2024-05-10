package com.ssafy.ododoc.process.dto.receive;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ModifiedFileDto {

    private String fileName;
    private String sourceCode;

}
