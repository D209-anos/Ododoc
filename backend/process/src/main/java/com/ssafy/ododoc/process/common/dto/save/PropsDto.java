package com.ssafy.ododoc.process.common.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PropsDto {

    private String nodeType;
    private String theme;
    private String language;
    private boolean checked;
    private SizesDto sizes;
    private String src;
    private String alt;
    private String bgColor;
    private String fit;
    private String target;
    private String rel;
    private String url;
    private String title;
    private Integer size;
    private String name;
    private String format;
}
