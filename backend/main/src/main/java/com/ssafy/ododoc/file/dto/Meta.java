package com.ssafy.ododoc.file.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Meta {

    private int order;
    private int depth;
}
