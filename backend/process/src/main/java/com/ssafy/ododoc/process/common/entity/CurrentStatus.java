package com.ssafy.ododoc.process.common.entity;

import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

@Getter
@RedisHash(value = "CurrentStatus")
@NoArgsConstructor
public class CurrentStatus {
    @Id
    private Integer id;
    @Indexed
    private Long connectedFileId;
    @Indexed
    private SourceApplicationType sourceApplication;
    private LocalDateTime timestamp;
    private StatusType status;

    public CurrentStatus(MessageRecord messageRecord, StatusType status) {
        this.connectedFileId = messageRecord.getConnectedFileId();
        this.sourceApplication = messageRecord.getSourceApplication();
        this.timestamp = messageRecord.getTimestamp();
        this.status = status;
    }
}
