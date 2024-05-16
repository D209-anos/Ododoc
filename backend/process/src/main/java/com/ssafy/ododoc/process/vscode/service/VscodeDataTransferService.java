package com.ssafy.ododoc.process.vscode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.FileBlockDto;
import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.service.FileBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VscodeDataTransferService {
    private final FileBlockService fileBlockService;
    private final ObjectMapper objectMapper;
    public LinkedHashMap<String, FileBlockDto> makeTroubleBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();
        IDEContentDto ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

        if(ideContentDto.getDetails() != null) {
            content = fileBlockService.makeHeadingThreeBlock(content, "터미널 로그");
            content = fileBlockService.makeTerminalBlock(content, ideContentDto.getDetails());
            content = fileBlockService.makeTextBlock(content, " ");
        }

        return content;
    }

    public LinkedHashMap<String, FileBlockDto> makeChangedCodeBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();
        IDEContentDto ideContentDto = objectMapper.convertValue(messageRecord.getContent(), IDEContentDto.class);

        List<ModifiedFileDto> modifiedFileList = ideContentDto.getModifiedFiles();
        if(!modifiedFileList.isEmpty()) {
            content = fileBlockService.makeHeadingThreeBlock(content, "변경된 코드");
            content = fileBlockService.makeCodeBlock(content, modifiedFileList);
            content = fileBlockService.makeTextBlock(content, " ");
        }

        return content;
    }

    public LinkedHashMap<String, FileBlockDto> makeSummaryBlocks(String summary) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        content = fileBlockService.makeGPTBlock(content, summary);
        content = fileBlockService.makeTextBlock(content, " ");

        return content;
    }
}
