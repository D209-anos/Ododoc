package com.ssafy.ododoc.process.entity;

import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@ToString
@RedisHash(value = "MessageRecord")
public class SourceCodeRecord {
    @Id
    private Integer id;
    private String sourceCode;
}
