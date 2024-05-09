package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Props {

    private String textColor;
    private String backgroundColor;
    private String textAlignment;
    private Integer level = 0;
    private String data;
}
