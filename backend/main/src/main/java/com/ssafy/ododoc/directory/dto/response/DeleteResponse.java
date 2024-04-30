package com.ssafy.ododoc.directory.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafy.ododoc.directory.type.DirectoryType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class DeleteResponse {

    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime trashbinTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deletedTime;

    private DirectoryType type;
}
