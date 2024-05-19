package com.ssafy.ododoc.process.chrome.service;

import com.ssafy.ododoc.gpt.GptService;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
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
    private final GptService gptService;

    public LinkedHashMap<String, FileBlockDto> makeKeywordBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        content = fileBlockService.makeHeadingTwoBlock(content, "검색 결과");
        content = fileBlockService.makeTextBlock(content, "");
        content = fileBlockService.makeHeadingThreeBlock(content, messageRecord.getContent().toString());

        return content;
    }

    public LinkedHashMap<String, FileBlockDto> makeSearchBlocks(MessageRecord messageRecord) {
        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        content = fileBlockService.makeLinkBlock(content, messageRecord.getContent().toString());

        String gptSummary = summarizeByGpt(messageRecord.getContent().toString());

        content = fileBlockService.makeGPTBlock(content, gptSummary, 2);
        content = fileBlockService.makeTextBlock(content, "");

        return content;
    }

    private String summarizeByGpt(String content) {
        String prompt = content + "\n위 URL의 내용을 한국어 5줄로 요약 정리해줘.";
        GptResponseDto chat = gptService.chat("gpt-4o", prompt, "http://localhost:8080/api");

        return chat.getChoices().get(0).getMessage().getContent();
    }
}
