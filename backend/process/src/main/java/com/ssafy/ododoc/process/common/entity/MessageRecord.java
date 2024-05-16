package com.ssafy.ododoc.process.common.entity;

import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@ToString
@RedisHash(value = "MessageRecord", timeToLive = 604_800) // 1주일 동안
public class MessageRecord {
    @Id
    private Integer id;
    private final SourceApplicationType sourceApplication;
    private final String accessToken;
    private final DataType dataType;
    private final Long connectedFileId;
    private final LocalDateTime timestamp;
    private final Object content;
    // 여기에 루트 디렉토리 추가해야할 듯? 하나의 IDE에서 두 개의 프로젝트를 작업하고 있을 수 있으니

    public MessageRecord(MessageDto messageDto) {
        this.sourceApplication = messageDto.getSourceApplication();
        this.accessToken = messageDto.getAccessToken();
        this.dataType = messageDto.getDataType();
        this.connectedFileId = messageDto.getConnectedFileId();
        this.timestamp = messageDto.getTimestamp();
        this.content = messageDto.getContent();
    }
}
