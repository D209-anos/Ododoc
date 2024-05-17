package com.ssafy.ododoc.file.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.ododoc.file.dto.Block;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.LinkedHashMap;

@Builder
@Getter
@Setter
@RedisHash(value = "file")
public class RedisFile implements Serializable {

    @Id
    private Long id;

    private Integer lastOrder;
    private LinkedHashMap<String, Block> content;
}
