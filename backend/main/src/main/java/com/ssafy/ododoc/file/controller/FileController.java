package com.ssafy.ododoc.file.controller;

import com.ssafy.ododoc.file.dto.response.ImageResponse;
import com.ssafy.ododoc.file.dto.annotation.CheckFile;
import com.ssafy.ododoc.file.service.FileService;
import com.ssafy.ododoc.member.entity.Member;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@Validated
public class FileController {

    private final FileService fileService;

    /**
     * 이미지 업로드 api.
     *
     * @param directoryId 이미지를 업로드 할 디렉토리 아이디
     * @param image 이미지 파일
     * @param member 로그인 한 멤버
     * @return 이미지 업로드 한 디렉토리 아이디, 이미지 S3 경로
     */
    @PostMapping("/image/{directoryId}")
    public ImageResponse uploadImage(@PathVariable @Min(value = 1, message = "Directory ID는 1 이상이어야 합니다.") Long directoryId,
                                     @RequestPart(value = "image") @CheckFile MultipartFile image,
                                     @AuthenticationPrincipal Member member) {
        return fileService.uploadImage(directoryId, image, member);
    }
}
