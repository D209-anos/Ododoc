package com.ssafy.ododoc.process.common.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DefaultPropsDto {

    private String textColor;
    private String backgroundColor;
    private String textAlignment;
    private int level;

}
