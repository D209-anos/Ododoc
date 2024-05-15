package com.ssafy.ododoc.process.common.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.process.common.dto.receive.IDEContentDto;
import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.*;
import com.ssafy.ododoc.process.common.entity.RedisFile;
import com.ssafy.ododoc.process.common.repository.RedisFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DataTransferService {

    private final ObjectMapper objectMapper;
    private final RedisFileRepository redisFileRepository;

    // 블럭으로 가공하는 로직
    public void makeFileBlock(MessageDto messageDto) {
        IDEContentDto ideContentDto = objectMapper.convertValue(messageDto.getContent(), IDEContentDto.class);

        RedisFile redisFile = redisFileRepository.findById(messageDto.getConnectedFileId())
                .orElseGet(() -> redisFileRepository.save(RedisFile.builder()
                        .id(messageDto.getConnectedFileId())
                        .lastOrder(0)
                        .content(new LinkedHashMap<>())
                        .build()));

        int lastOrder = redisFile.getLastOrder();

        if(lastOrder != 0) {
            lastOrder++;
        }

        LinkedHashMap<String, FileBlockDto> content = redisFile.getContent();

        /**
         *  코드 블럭 만들기
         */
        List<ModifiedFileDto> modifiedFileList = ideContentDto.getModifiedFiles();

        FileBlockDto totalHeader = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("heading-two")
                        .children(List.of(ContentDto.builder()
                                .text("개발 결과")
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("HeadingThree")
                .meta(MetaDto.builder()
                        .order(lastOrder++)
                        .depth(0)
                        .build())
                .build();

        content.putLast(totalHeader.getId(), totalHeader);
        if(!modifiedFileList.isEmpty()) {
            // 변경된 코드 헤더 만들기
            FileBlockDto modifiedHeader = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("heading-three")
                            .children(List.of(ContentDto.builder()
                                    .text("변경된 코드")
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("HeadingThree")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(modifiedHeader.getId(), modifiedHeader);

            for (ModifiedFileDto file : modifiedFileList) {
                // 파일 이름 블럭
                FileBlockDto fileNameBlock = FileBlockDto.builder()
                        .id(UUID.randomUUID().toString())
                        .value(List.of(ValueDto.builder()
                                .id(UUID.randomUUID().toString())
                                .type("bulleted-list")
                                .children(List.of(ContentDto.builder()
                                        .text(file.getFileName())
                                        .build()))
                                .props(PropsDto.builder()
                                        .nodeType("block")
                                        .build())
                                .build()))
                        .type("BulletedList")
                        .meta(MetaDto.builder()
                                .order(lastOrder++)
                                .depth(1)
                                .build())
                        .build();

                content.putLast(fileNameBlock.getId(), fileNameBlock);

                // 변경된 코드 내용이 담긴 코드 블럭
                FileBlockDto codeBlock = FileBlockDto.builder()
                        .id(UUID.randomUUID().toString())
                        .value(List.of(
                                        ValueDto.builder()
                                                .id(UUID.randomUUID().toString())
                                                .type("code")
                                                .children(List.of(ContentDto.builder()
                                                        .text(file.getSourceCode())
                                                        .build()))
                                                .props(PropsDto.builder()
                                                        .nodeType("void")
                                                        .language("java")
                                                        .theme("GithubLight")
                                                        .build())
                                                .build()
                                )
                        )
                        .type("Code")
                        .meta(MetaDto.builder()
                                .order(lastOrder++)
                                .depth(1)
                                .build())
                        .build();

                content.putLast(codeBlock.getId(), codeBlock);
            }
        }

        /**
         * 에러 발생 코드 블럭 만들기
         */
        if(ideContentDto.getErrorFile() != null) {
            // 변경된 코드와 에러 발생 코드 사이 띄어쓰기
            FileBlockDto emptyLine = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("paragraph")
                            .children(List.of(ContentDto.builder()
                                    .text("")
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("Paragraph")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(emptyLine.getId(), emptyLine);

            // 에러 발생 코드 헤더 만들기
            FileBlockDto errorHeader = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("heading-three")
                            .children(List.of(ContentDto.builder()
                                    .text("에러 발생 코드")
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("HeadingThree")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(errorHeader.getId(), errorHeader);

            // 파일 이름 블럭
            FileBlockDto errorFileNameBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("bulleted-list")
                            .children(List.of(ContentDto.builder()
                                    .text(ideContentDto.getErrorFile().getFileName())
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("BulletedList")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(1)
                            .build())
                    .build();

            content.putLast(errorFileNameBlock.getId(), errorFileNameBlock);

            // 에러 발생 코드 내용이 담긴 코드 블럭
            FileBlockDto errorCodeBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(
                                    ValueDto.builder()
                                            .id(UUID.randomUUID().toString())
                                            .type("code")
                                            .children(List.of(ContentDto.builder()
                                                    .text(ideContentDto.getErrorFile().getSourceCode())
                                                    .build()))
                                            .props(PropsDto.builder()
                                                    .nodeType("void")
                                                    .language("java")
                                                    .theme("GithubLight")
                                                    .build())
                                            .build()
                            )
                    )
                    .type("Code")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(1)
                            .build())
                    .build();

            content.putLast(errorCodeBlock.getId(), errorCodeBlock);
        }

        /**
         *  터미널 블럭 만들기
         */
        if(ideContentDto.getDetails() != null) {
            // 에러 발생 코드와 터미널 사이 띄어쓰기
            FileBlockDto emptyLine = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("paragraph")
                            .children(List.of(ContentDto.builder()
                                    .text("")
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("Paragraph")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(emptyLine.getId(), emptyLine);

            FileBlockDto terminalHeader = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("heading-three")
                            .children(List.of(ContentDto.builder()
                                    .text("터미널 로그")
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("HeadingThree")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(terminalHeader.getId(), terminalHeader);

            FileBlockDto terminalBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("code")
                            .children(List.of(ContentDto.builder()
                                    .text(ideContentDto.getDetails())
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("void")
                                    .language("yaml")
                                    .theme("GithubDark")
                                    .build())
                            .build()))
                    .type("Code")
                    .meta(MetaDto.builder()
                            .order(lastOrder++)
                            .depth(0)
                            .build())
                    .build();

            content.putLast(terminalBlock.getId(), terminalBlock);
        }

        try {
            System.out.println(objectMapper.writeValueAsString(redisFile));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        redisFile.setLastOrder(lastOrder - 1);
        redisFile.setContent(content);
        redisFileRepository.save(redisFile);
    }


}
