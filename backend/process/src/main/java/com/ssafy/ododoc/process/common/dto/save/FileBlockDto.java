package com.ssafy.ododoc.process.common.dto.save;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FileBlockDto {

    private String id;
    private List<ValueDto> value;
    private String type;
    private MetaDto meta;
}
