package com.ssafy.ododoc.process.entity;

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
}
