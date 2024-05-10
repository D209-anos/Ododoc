package com.ssafy.ododoc.file;

import com.ssafy.ododoc.file.dto.Block;
import com.ssafy.ododoc.file.dto.Content;
import com.ssafy.ododoc.file.dto.Props;
import com.ssafy.ododoc.file.dto.Styles;
import com.ssafy.ododoc.file.dto.request.FileRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FileSteps {

    private final String blockId = "c329b660-69e3-47f5-a296-6d123d42aeab";
    private final String type = "paragraph";
    private Props props = Props.builder().
            textColor("default")
            .backgroundColor("default")
            .textAlignment("left")
            .build();

    private Styles styles = Styles.builder()
            .bold(false)
            .italic(false)
            .underline(false)
            .strike(false)
            .code(false)
            .build();

    private List<Content> content = List.of(Content.builder()
            .type("text")
            .text("테스트")
            .styles(styles)
            .build());

    private Block block = Block.builder()
            .id(blockId)
            .type(type)
            .props(props)
            .content(content)
            .build();

    private List<Block> contentList = List.of(block);

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
