package com.ssafy.ododoc.process.common.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class StyleDto {

    private boolean bold;
    private boolean italic;
    private boolean underline;
    private boolean strike;
    private boolean code;
    private String textColor;
    private String backgroundColor;

}
