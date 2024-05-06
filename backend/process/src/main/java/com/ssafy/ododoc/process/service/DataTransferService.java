package com.ssafy.ododoc.process.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.dto.save.BuildResultPropsDto;
import com.ssafy.ododoc.process.dto.save.ContentDto;
import com.ssafy.ododoc.process.dto.save.FileBlockDto;
import com.ssafy.ododoc.process.dto.save.DefaultPropsDto;
import com.ssafy.ododoc.process.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DataTransferService {

    private final ObjectMapper objectMapper;

    public void transferDataForSave(MessageDto messageDto) {
        System.out.println(makeFileBlock(messageDto));
        // Todo : 메인서버로 저장 요청
    }

    // 블럭으로 가공하는 로직
    private FileBlockDto makeFileBlock(MessageDto messageDto) {
        IDEContentDto contentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        /**
         *  코드 블럭 만들기
         */
        List<FileBlockDto> codeBlocks = new ArrayList<>();
        List<ModifiedFileDto> modifiedFileList = contentDto.getModifiedFiles();
        for(ModifiedFileDto file : modifiedFileList){

            // 변경된 코드 내용이 담긴 코드 블럭
            FileBlockDto codeBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("procode")
                    .props(BuildResultPropsDto.builder()
                            .data(file.getSourceCode())
                            .build())
                    .build();

            List<FileBlockDto> children = new ArrayList<>();
            children.add(codeBlock);

            // 파일 이름 블럭
            FileBlockDto fileNameBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("bulletListItem")
                    .props(DefaultPropsDto.builder()
                            .textColor("default")
                            .backgroundColor("default")
                            .textAlignment("left")
                            .build())
                    .content(ContentDto.builder()
                            .type("text")
                            .text(file.getFileName())
                            .build())
                    .children(children)
                    .build();

            codeBlocks.add(fileNameBlock);
        }

        // 코드 헤드 블럭
        FileBlockDto codeHeaderBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .type("heading")
                .props(DefaultPropsDto.builder()
                        .textColor("default")
                        .backgroundColor("default")
                        .textAlignment("left")
                        .level(3)
                        .build()
                )
                .content(ContentDto.builder()
                        .type("text")
                        .text("변경된 코드")
                        .build())
                .children(codeBlocks)
                .build();

        /**
         *  터미널 블럭 만들기
         */
        FileBlockDto terminalBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .type("terminal")
                .props(BuildResultPropsDto.builder()
                        .data(contentDto.getDetails())
                        .build())
                .build();

        List<FileBlockDto> terminalBlocks = new ArrayList<>();
        terminalBlocks.add(terminalBlock);

        FileBlockDto terminalHeaderBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .type("heading")
                .props(DefaultPropsDto.builder()
                        .textColor("default")
                        .backgroundColor("default")
                        .textAlignment("left")
                        .level(3)
                        .build()
                )
                .content(ContentDto.builder()
                        .type("text")
                        .text("터미널 결과")
                        .build())
                .children(terminalBlocks)
                .build();

        /**
         *  헤더 블럭 만들기
         */
        List<FileBlockDto> codeAndTerminalBlocks = new ArrayList<>();
        codeAndTerminalBlocks.add(codeHeaderBlock);
        codeAndTerminalBlocks.add(terminalHeaderBlock);

        String headerText = messageDto.getDataType() == DataType.OUTPUT ? "빌드 성공" : "빌드 실패";
        FileBlockDto headerBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .type("heading")
                .props(DefaultPropsDto.builder()
                        .textColor("default")
                        .backgroundColor("default")
                        .textAlignment("left")
                        .level(2)
                        .build()
                )
                .content(ContentDto.builder()
                        .type("text")
                        .text(headerText)
                        .build())
                .children(codeAndTerminalBlocks)
                .build();

        return headerBlock;
    }

    private void sendRequest() {

    }

}
