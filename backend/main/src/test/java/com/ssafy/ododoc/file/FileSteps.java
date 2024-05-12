package com.ssafy.ododoc.file;

import com.ssafy.ododoc.file.dto.*;
import com.ssafy.ododoc.file.dto.request.FileRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FileSteps {

    private final String blockId = "a10a4656-4ca4-4271-86cc-3cb1351ed3a6";
    private final String valueId = "ae39c537-dba2-4192-8b40-cf8ab8c84a46";
    private final String type = "paragraph";

    private Props props = Props.builder()
            .nodeType("block")
            .build();

    private List<Content> content = List.of(Content.builder()
            .text("파일 내용 테스트")
            .build());

    private List<Value> value = List.of(Value.builder()
            .id(valueId)
            .type(type)
            .children(content)
            .props(props)
            .build());

    private Meta meta = Meta.builder()
            .order(0)
            .depth(0)
            .build();

    private List<Block> contentList = List.of(Block.builder()
            .id(blockId)
            .value(value)
            .type(type)
            .meta(meta)
            .build());

    public FileRequest 저장파일_생성(Long directoryId) {
        return FileRequest.builder()
                .directoryId(directoryId)
                .content(contentList)
                .build();
    }

    public FileRequest 저장파일_비어있음_생성(Long directoryId) {
        return FileRequest.builder()
                .directoryId(directoryId)
                .content(new ArrayList<>())
                .build();
    }

    public FileRequest 저장파일_Null_생성(Long directoryId) {
        return FileRequest.builder()
                .directoryId(directoryId)
                .content(null)
                .build();
    }
}
