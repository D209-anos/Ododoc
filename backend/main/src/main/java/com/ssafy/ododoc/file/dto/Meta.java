package com.ssafy.ododoc.file.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Meta {

    private int order;
    private int depth;
}
