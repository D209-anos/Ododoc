package com.ssafy.ododoc.process.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.BuildResultPropsDto;
import com.ssafy.ododoc.process.common.dto.save.ContentDto;
import com.ssafy.ododoc.process.common.dto.save.FileBlockDto;
import com.ssafy.ododoc.process.common.dto.save.DefaultPropsDto;
import com.ssafy.ododoc.process.common.type.DataType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DataTransferService {

    private final ObjectMapper objectMapper;
    private final String URI = "http://localhost:8080/api/directory/test";

    public void transferDataForSave(MessageDto messageDto) {
        sendRequest(makeFileBlock(messageDto), messageDto);
    }

    // 블럭으로 가공하는 로직
    private FileBlockDto makeFileBlock(MessageDto messageDto) {
        IDEContentDto contentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        /**
         *  코드 블럭 만들기
         */
        List<FileBlockDto> codeBlocks = new ArrayList<>();
        List<ModifiedFileDto> modifiedFileList = contentDto.getModifiedFiles();
        for (ModifiedFileDto file : modifiedFileList) {

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

    private void sendRequest(FileBlockDto fileBlockDto, MessageDto messageDto) {
        WebClient webClient = WebClient.builder()
                .baseUrl(URI)
                .defaultHeader("Content-type","application/json")
                .defaultHeader("Authorization", messageDto.getAccessToken())
                .build();

        MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("connectedFileId", messageDto.getConnectedFileId());
        requestBody.add("fileBlock", fileBlockDto);

        webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

    }

}
