package com.ssafy.ododoc.process.common.dto.save;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class ValueDto {

    private String id;
    private String type;
    private List<ContentDto> children;
    private PropsDto props;
}
