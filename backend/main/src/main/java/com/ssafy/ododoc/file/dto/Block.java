package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Builder
@Getter
public class Block {

    @Field("id")
    private String id;
    private List<Value> value;
    private String type;
    private Meta meta;
}
