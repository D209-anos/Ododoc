package com.ssafy.ododoc.process.common.service;

import com.ssafy.ododoc.process.common.dto.receive.ErrorFileDto;
import com.ssafy.ododoc.process.common.dto.receive.ModifiedFileDto;
import com.ssafy.ododoc.process.common.dto.save.*;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

@Component
public class FileBlockService {

    /**
     * 코드 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param modifiedFileList 변경된 코드 리스트
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeCodeBlock(LinkedHashMap<String, FileBlockDto> contentMap, List<ModifiedFileDto> modifiedFileList) {
        for(ModifiedFileDto modifiedFile : modifiedFileList) {
            System.out.println("modified file name?? " + modifiedFile.getFileName());
            // 파일 이름 블럭
            FileBlockDto fileNameBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("bulleted-list")
                            .children(List.of(ContentDto.builder()
                                    .text(modifiedFile.getFileName())
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("BulletedList")
                    .meta(MetaDto.builder()
                            .order(0)
                            .depth(1)
                            .build())
                    .build();

            // 변경된 코드 내용이 담긴 코드 블럭
            FileBlockDto codeBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(
                                    ValueDto.builder()
                                            .id(UUID.randomUUID().toString())
                                            .type("code")
                                            .children(List.of(ContentDto.builder()
                                                    .text(modifiedFile.getSourceCode())
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
                            .order(0)
                            .depth(1)
                            .build())
                    .build();

            contentMap.putLast(fileNameBlock.getId(), fileNameBlock);
            contentMap.putLast(codeBlock.getId(), codeBlock);
        }

        return contentMap;
    }

    /**
     * GPT 요약과 코드 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param modifiedFileList 변경된 코드 리스트
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeCodeBlockWithGPT (LinkedHashMap<String, FileBlockDto> contentMap, List<ModifiedFileDto> modifiedFileList, List<String> modifyFileSummarize) {
        int count = 0;
        for(ModifiedFileDto modifiedFile : modifiedFileList) {
            System.out.println("modified file name?? " + modifiedFile.getFileName());
            // 파일 이름 블럭
            FileBlockDto fileNameBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("bulleted-list")
                            .children(List.of(ContentDto.builder()
                                    .text(modifiedFile.getFileName())
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("BulletedList")
                    .meta(MetaDto.builder()
                            .order(0)
                            .depth(1)
                            .build())
                    .build();

            // 변경된 코드 내용이 담긴 코드 블럭
            FileBlockDto codeBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(
                                    ValueDto.builder()
                                            .id(UUID.randomUUID().toString())
                                            .type("code")
                                            .children(List.of(ContentDto.builder()
                                                    .text(modifiedFile.getSourceCode())
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
                            .order(0)
                            .depth(1)
                            .build())
                    .build();

            // GPT 요약이 담긴 블럭
            FileBlockDto gptBlock = FileBlockDto.builder()
                    .id(UUID.randomUUID().toString())
                    .value(List.of(ValueDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("blockquote")
                            .children(List.of(ContentDto.builder()
                                    .text("GPT 요약")
                                    .bold(true)
                                    .build(), ContentDto.builder()
                                    .text("\n" + modifyFileSummarize.get(count))
                                    .build()))
                            .props(PropsDto.builder()
                                    .nodeType("block")
                                    .build())
                            .build()))
                    .type("Blockquote")
                    .meta(MetaDto.builder()
                            .order(0)
                            .depth(1)
                            .build())
                    .build();

            contentMap.putLast(fileNameBlock.getId(), fileNameBlock);
            contentMap.putLast(codeBlock.getId(), codeBlock);
            contentMap.putLast(gptBlock.getId(), gptBlock);
            count++;
        }

        return contentMap;
    }

    /**
     * 에러 코드 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param errorFileDto 에러 발생 코드
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeErrorBlock(LinkedHashMap<String, FileBlockDto> contentMap, ErrorFileDto errorFileDto) {
        // 파일 이름 블럭
        FileBlockDto errorFileNameBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("bulleted-list")
                        .children(List.of(ContentDto.builder()
                                .text(errorFileDto.getFileName() + " : " + errorFileDto.getLine())
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("BulletedList")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(1)
                        .build())
                .build();

        // 에러 발생 코드 내용이 담긴 코드 블럭
        FileBlockDto errorCodeBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("code")
                        .children(List.of(ContentDto.builder()
                                .text(errorFileDto.getSourceCode())
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("void")
                                .language("java")
                                .theme("GithubLight")
                                .build())
                        .build()))
                .type("Code")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(1)
                        .build())
                .build();

        contentMap.put(errorFileNameBlock.getId(), errorFileNameBlock);
        contentMap.put(errorCodeBlock.getId(), errorCodeBlock);

        return contentMap;
    }

    /**
     * 터미널 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param detail 터미널 로그
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeTerminalBlock(LinkedHashMap<String, FileBlockDto> contentMap, String detail) {
        FileBlockDto terminalBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("code")
                        .children(List.of(ContentDto.builder()
                                .text(detail)
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("void")
                                .language("yaml")
                                .theme("GithubDark")
                                .build())
                        .build()))
                .type("Code")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(0)
                        .build())
                .build();

        contentMap.put(terminalBlock.getId(), terminalBlock);

        return contentMap;
    }

    /**
     * 텍스트 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param text 작성할 text
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeTextBlock(LinkedHashMap<String, FileBlockDto> contentMap, String text) {
        FileBlockDto textBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("paragraph")
                        .children(List.of(ContentDto.builder()
                                .text(text)
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("Paragraph")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(0)
                        .build())
                .build();

        contentMap.putLast(textBlock.getId(), textBlock);
        return contentMap;
    }

    /**
     * 제목2 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param text 제목 내용 text
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeHeadingTwoBlock(LinkedHashMap<String, FileBlockDto> contentMap, String text) {
        FileBlockDto headingTwoBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("heading-two")
                        .children(List.of(ContentDto.builder()
                                .text(text)
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("HeadingTwo")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(0)
                        .build())
                .build();

        contentMap.putLast(headingTwoBlock.getId(), headingTwoBlock);
        return contentMap;
    }

    /**
     * 제목3 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param text 제목 내용 text
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeHeadingThreeBlock(LinkedHashMap<String, FileBlockDto> contentMap, String text) {
        FileBlockDto headingThreeBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("heading-three")
                        .children(List.of(ContentDto.builder()
                                .text(text)
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("HeadingThree")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(0)
                        .build())
                .build();

        contentMap.putLast(headingThreeBlock.getId(), headingThreeBlock);
        return contentMap;
    }

    /**
     * GPT 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param text GPT 요약된 문장
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeGPTBlock(LinkedHashMap<String, FileBlockDto> contentMap, String text, int depth) {
        FileBlockDto gptBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("blockquote")
                        .children(List.of(ContentDto.builder()
                                .text("GPT 요약")
                                .bold(true)
                                .build(), ContentDto.builder()
                                .text("\n" + text)
                                .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("Blockquote")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(depth)
                        .build())
                .build();

        contentMap.putLast(gptBlock.getId(), gptBlock);
        return contentMap;
    }

    /**
     * 링크 블럭 만들기
     *
     * @param contentMap 메인 서버로 보낼 Map
     * @param url 방문한 url
     * @return 메인 서버로 보낼 Map
     */
    public LinkedHashMap<String, FileBlockDto> makeLinkBlock(LinkedHashMap<String, FileBlockDto> contentMap, String url) {
        FileBlockDto linkBlock = FileBlockDto.builder()
                .id(UUID.randomUUID().toString())
                .value(List.of(ValueDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("bulleted-list")
                        .children(List.of(
                                ContentDto.builder()
                                        .text("")
                                        .build(),
                                ContentDto.builder()
                                        .type("link")
                                        .children(List.of(ContentDto.builder()
                                                .text(url)
                                                .build()))
                                        .props(PropsDto.builder()
                                                .nodeType("inline")
                                                .target("_blank")
                                                .rel("noreferrer")
                                                .url(url)
                                                .title(url)
                                                .build())
                                        .build(),
                                ContentDto.builder()
                                        .text("")
                                        .build()))
                        .props(PropsDto.builder()
                                .nodeType("block")
                                .build())
                        .build()))
                .type("BulletedList")
                .meta(MetaDto.builder()
                        .order(0)
                        .depth(1)
                        .build())
                .build();

        contentMap.putLast(linkBlock.getId(), linkBlock);
        return contentMap;
    }
}
