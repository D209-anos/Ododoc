package com.ssafy.ododoc.process.common.dto.save;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MetaDto {

    private int order;
    private int depth;
}
