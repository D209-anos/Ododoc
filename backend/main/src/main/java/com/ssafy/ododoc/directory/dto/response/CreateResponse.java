package com.ssafy.ododoc.directory.dto.response;

import com.ssafy.ododoc.directory.type.DirectoryType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CreateResponse {

    private Long id;
    private String name;
    private DirectoryType type;
    private Long parentId;
}
