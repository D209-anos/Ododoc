package com.ssafy.ododoc.directory;

import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import org.springframework.stereotype.Component;

@Component
public class DirectorySteps {

    public CreateRequest 폴더정보_생성_이름_상위_없음() {
        return CreateRequest.builder()
                .name("")
                .parentId(null)
                .type("folder")
                .build();
    }

    public CreateRequest 폴더정보_생성_이름_상위_있음(Long parentId) {
        return CreateRequest.builder()
                .name("폴더명")
                .parentId(parentId)
                .type("folder")
                .build();
    }

    public CreateRequest 파일정보_생성_이름없음(Long parentId) {
        return CreateRequest.builder()
                .name("")
                .parentId(parentId)
                .type("file")
                .build();
    }

    public CreateRequest 파일정보_잘못생성_타입오류(Long parentId) {
        return CreateRequest.builder()
                .name("")
                .parentId(parentId)
                .type("파일")
                .build();
    }

    public CreateRequest 파일정보_잘못생성_이름없음(Long parentId) {
        return CreateRequest.builder()
                .name(null)
                .parentId(parentId)
                .type("file")
                .build();
    }

    public CreateRequest 파일정보_잘못생성_상위없음() {
        return CreateRequest.builder()
                .name("")
                .parentId(null)
                .type("file")
                .build();
    }
}
