package com.ssafy.ododoc.process.dto.receive;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ModifiedFileDto {

    private String fileName;
    private String sourceCode;

}
