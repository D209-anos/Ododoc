package com.ssafy.ododoc.directory.dto.response;

import com.ssafy.ododoc.directory.type.DirectoryType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class DirectoryResponse {

    private Long id;
    private String name;
    private DirectoryType type;
    private List<DirectoryResponse> children;

    public void addChild(DirectoryResponse child) {
        this.children.add(child);
    }
}
