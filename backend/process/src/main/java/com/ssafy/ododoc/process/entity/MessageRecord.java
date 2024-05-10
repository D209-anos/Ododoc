package com.ssafy.ododoc.process.entity;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.type.DataType;
import com.ssafy.ododoc.process.type.SourceApplicationType;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@ToString
@RedisHash(value = "PMessage", timeToLive = 604_800) // 1주일 동안
public class PMessage {
    @Id
    private Integer id;
    private SourceApplicationType sourceApplication;
    private String accessToken;
    private DataType dataType;
    private long connectedFileId;
    private LocalDateTime timestamp;
    private Object content;
    // 여기에 루트 디렉토리 추가해야할 듯? 하나의 IDE에서 두 개의 프로젝트를 작업하고 있을 수 있으니

    public PMessage(MessageDto messageDto) {
        this.sourceApplication = messageDto.getSourceApplication();
        this.accessToken = messageDto.getAccessToken();
        this.dataType = messageDto.getDataType();
        this.connectedFileId = messageDto.getConnectedFileId();
        this.timestamp = messageDto.getTimestamp();
        this.content = messageDto.getContent();
    }
}
