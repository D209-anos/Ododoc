package com.ssafy.ododoc.process.common.entity;

import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

@Getter
@Builder
@RedisHash(value = "CurrentStatus")
public class CurrentStatus {
    @Id
    private Integer id;
    @Indexed
    private Long connectedFileId;
    @Indexed
    private SourceApplicationType sourceApplication;
    private LocalDateTime timestamp;
    private StatusType status;
}
