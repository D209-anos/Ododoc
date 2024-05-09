package com.ssafy.ododoc.process.dto.save;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Builder
public class ContentDto {

    private String type;
    private String text;

    @Builder.Default
    private StyleDto styles = new StyleDto();

}
