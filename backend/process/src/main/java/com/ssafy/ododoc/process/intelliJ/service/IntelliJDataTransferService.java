package com.ssafy.ododoc.process.intelliJ.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.*;
import com.ssafy.ododoc.process.common.service.FileBlockService;
import com.ssafy.ododoc.process.common.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IntelliJDataTransferService {

    private final ObjectMapper objectMapper;
    private final FileBlockService fileBlockService;

    // 블럭으로 가공하는 로직
    public LinkedHashMap<String, FileBlockDto> makeFileBlock(MessageDto messageDto, GPTSummarizeDto gptSummarizeDto) {
        IDEContentDto ideContentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        LinkedHashMap<String, FileBlockDto> content = new LinkedHashMap<>();

        if(!(ideContentDto.getDetails() == null && ideContentDto.getErrorFile() == null && ideContentDto.getModifiedFiles().isEmpty())){
            if(messageDto.getDataType().equals(DataType.ERROR)){
                content = fileBlockService.makeHeadingTwoBlock(content, "개발 결과 : 에러 발생");
                content = fileBlockService.makeTextBlock(content, "");
            }
            else if(messageDto.getDataType().equals(DataType.OUTPUT)){
                content = fileBlockService.makeHeadingTwoBlock(content, "개발 결과");
                content = fileBlockService.makeTextBlock(content, "");
            }
        }

        /**
         *  코드 블럭 만들기
         */
        List<ModifiedFileDto> modifiedFileList = ideContentDto.getModifiedFiles();
        List<String> modifyFileSummarize = gptSummarizeDto.getModifyFileSummarize();
        if(!modifiedFileList.isEmpty()) {
            content = fileBlockService.makeHeadingThreeBlock(content, "변경된 코드");
            content = fileBlockService.makeCodeBlockWithGPT(content, modifiedFileList, modifyFileSummarize);
            content = fileBlockService.makeTextBlock(content, "");
        }

        /**
         * 에러 발생 코드 블럭 만들기
         */
        if(ideContentDto.getErrorFile() != null) {
            content = fileBlockService.makeHeadingThreeBlock(content, "에러 발생 코드");
            content = fileBlockService.makeErrorBlock(content, ideContentDto.getErrorFile());
            content = fileBlockService.makeGPTBlock(content, gptSummarizeDto.getErrorFileLogSummarize(), 1);
            content = fileBlockService.makeTextBlock(content, "");
        }

        /**
         *  터미널 블럭 만들기
         */
        if(ideContentDto.getDetails() != null) {
            content = fileBlockService.makeHeadingThreeBlock(content, "터미널 로그");
            content = fileBlockService.makeTerminalBlock(content, ideContentDto.getDetails());
            content = fileBlockService.makeGPTBlock(content, gptSummarizeDto.getTerminalLogSummarize(), 0);
            content = fileBlockService.makeTextBlock(content, "");
        }

        return content;
    }
}
