package com.ssafy.ododoc.directory.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafy.ododoc.directory.type.DirectoryType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class TrashbinResponse {

    private Long id;
    private String name;
    private DirectoryType type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime trashbinTime;
    private List<TrashbinResponse> children;

    public void addChild(TrashbinResponse child) {
        this.children.add(child);
    }
}
