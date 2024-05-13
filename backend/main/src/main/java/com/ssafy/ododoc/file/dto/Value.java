package com.ssafy.ododoc.file.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class Value {

    private String id;
    private String type;
    private List<Content> children;
    private Props props;
}
