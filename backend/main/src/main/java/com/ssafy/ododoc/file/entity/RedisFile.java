package com.ssafy.ododoc.file.entity;

import com.ssafy.ododoc.file.dto.Block;
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

    private LinkedHashMap<String, Block> content;
}
