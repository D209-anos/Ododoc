package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Content {

    private String text;
    private boolean bold;
    private boolean italic;
    private boolean underline;
    private boolean strike;
    private boolean code;
    private Highlight highlight;
    private String type;
    private List<Content> children;
    private Props props;
}
