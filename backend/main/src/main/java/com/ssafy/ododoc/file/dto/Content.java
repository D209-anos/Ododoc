package com.ssafy.ododoc.file.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Content {

    private String type;
    private String text;
    private Styles styles;
}
