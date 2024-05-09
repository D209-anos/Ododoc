package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Block {

    @Field("id")
    private String id;
    private String type;
    private Props props;
    private List<Content> content;
    private List<Block> children;
}
