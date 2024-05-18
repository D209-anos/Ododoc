package com.ssafy.ododoc.process.common.dto.save;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GPTSummarizeDto {
    
    private List<String> modifyFileSummarize;
    private String terminalLogSummarize;
    private String errorFileLogSummarize;

}
