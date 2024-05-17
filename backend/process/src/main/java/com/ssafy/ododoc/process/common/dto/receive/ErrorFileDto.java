package com.ssafy.ododoc.process.common.dto.receive;

import lombok.Getter;

@Getter
public class ErrorFileDto {

    private String fileName;
    private String sourceCode;
    private int line;
}
