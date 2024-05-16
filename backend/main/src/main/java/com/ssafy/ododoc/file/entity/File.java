package com.ssafy.ododoc.file.entity;

import com.ssafy.ododoc.file.dto.Block;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.LinkedHashMap;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class File {

    @Id
    private String id;

    private Long directoryId;
    private Integer lastOrder;
    private LinkedHashMap<String, Block> content;
}
