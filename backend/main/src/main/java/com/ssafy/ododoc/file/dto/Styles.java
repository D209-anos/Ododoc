package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Styles {

    private boolean bold;
    private boolean italic;
    private boolean underline;
    private boolean strike;
    private boolean code;
    private String textColor;
    private String backgroundColor;
}
