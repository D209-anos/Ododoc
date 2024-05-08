package com.ssafy.ododoc.process.dto.receive;

import com.ssafy.ododoc.process.type.DataType;
import com.ssafy.ododoc.process.type.SourceApplicationType;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Getter
@ToString
public class MessageDto {
    private SourceApplicationType sourceApplication;
    private String accessToken;
    private DataType dataType;
    private long connectedFileId;
    private LocalDateTime timestamp;
    private Object content;
}
