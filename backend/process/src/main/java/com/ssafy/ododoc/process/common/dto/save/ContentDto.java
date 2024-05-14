package com.ssafy.ododoc.process.common.dto.save;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ContentDto {

    private String type;
    private String text;

    @Builder.Default
    private StyleDto styles = new StyleDto();

}
