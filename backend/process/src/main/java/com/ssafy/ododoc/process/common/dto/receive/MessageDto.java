package com.ssafy.ododoc.process.common.dto.receive;

import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
public class MessageDto {
    private SourceApplicationType sourceApplication;
    private String accessToken;
    private DataType dataType;
    private Long connectedFileId;
    private LocalDateTime timestamp;
    private Object content;
}
