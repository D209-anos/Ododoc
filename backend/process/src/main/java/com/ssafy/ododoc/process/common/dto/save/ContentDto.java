package com.ssafy.ododoc.process.common.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class ContentDto {

    private String text;
    private boolean bold;
    private boolean italic;
    private boolean underline;
    private boolean strike;
    private boolean code;
    private HighlightDto highlight;
    private String type;
    private List<ContentDto> children;
    private PropsDto props;
}
