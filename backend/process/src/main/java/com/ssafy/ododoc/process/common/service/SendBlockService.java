package com.ssafy.ododoc.process.common.service;

import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.dto.save.FileBlockDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;

@Component
@Slf4j
public class SendBlockService {

    private final String URI = "https://k10d209.p.ssafy.io/api/file/add";

    public void sendRequest(LinkedHashMap<String, FileBlockDto> content, MessageDto messageDto) {
        log.info("sendRequest 호출!!!");
        WebClient webClient = WebClient.builder()
                .baseUrl(URI)
                .defaultHeader("Content-type", "application/json")
                .defaultHeader("Authorization", messageDto.getAccessToken())
                .build();

        String type = "";

        switch(messageDto.getDataType()) {
            case OUTPUT -> type = "success";
            case ERROR -> type = "fail";
            case KEYWORD -> type = "keyword";
            case SEARCH -> type = "search";
        }

        LinkedHashMap<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("connectedFileId", messageDto.getConnectedFileId());
        requestBody.put("type", type);
        requestBody.put("fileBlock", content);

        webClient.put()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(mono -> log.info("webClient 요청 성공!!"))
                .doOnError(e -> log.info("요청 실패 : {}", e.getMessage()))
                .subscribe();
    }
}
