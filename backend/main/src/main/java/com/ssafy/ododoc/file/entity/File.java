package com.ssafy.ododoc.file.entity;

import com.ssafy.ododoc.file.dto.Block;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class File {

    @Id
    private String id;

    private Long directoryId;
    private List<Block> content;
}
