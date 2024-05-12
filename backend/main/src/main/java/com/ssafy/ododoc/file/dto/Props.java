package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Props {

    private String nodeType;
    private String theme;
    private String language;
    private boolean checked;
    private Sizes sizes;
    private String src;
    private String alt;
    private String bgColor;
    private String fit;
    private String target;
    private String rel;
    private String url;
    private String title;
}
