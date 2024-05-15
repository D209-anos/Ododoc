package com.ssafy.ododoc.process.common.entity;

import com.ssafy.ododoc.process.common.dto.save.FileBlockDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.LinkedHashMap;

@Builder
@Getter
@Setter
@RedisHash(value = "file")
public class RedisFile {

    @Id
    private Long id;

    private Integer lastOrder;
    private LinkedHashMap<String, FileBlockDto> content;
}
