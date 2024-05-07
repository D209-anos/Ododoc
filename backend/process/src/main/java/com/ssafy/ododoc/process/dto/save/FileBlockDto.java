package com.ssafy.ododoc.process.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileBlockDto {

    private String id;
    private String type;
    private Object props;
    private ContentDto content;

    @Builder.Default
    private List<FileBlockDto> children = new ArrayList<>();

}
