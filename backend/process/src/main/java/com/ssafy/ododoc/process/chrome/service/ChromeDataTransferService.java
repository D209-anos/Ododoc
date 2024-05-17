package com.ssafy.ododoc.process.chrome.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.save.FileBlockDto;
import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.service.FileBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
public class ChromeDataTransferService {
    private final FileBlockService fileBlockService;
    private final ObjectMapper objectMapper;

    public LinkedHashMap<String, FileBlockDto> makeKeywordBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        return content;
    }
    public LinkedHashMap<String, FileBlockDto> makeSearchBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        return content;
    }

}
