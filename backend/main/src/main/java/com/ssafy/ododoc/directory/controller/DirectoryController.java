package com.ssafy.ododoc.directory.controller;

import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import com.ssafy.ododoc.directory.dto.response.CreateResponse;
import com.ssafy.ododoc.directory.dto.response.ProfileResponse;
import com.ssafy.ododoc.directory.service.DirectoryService;
import com.ssafy.ododoc.member.entity.Member;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * @author 김주이
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/directory")
public class DirectoryController {

    private final DirectoryService directoryService;

    /**
     * 로그인 후 프로필 페이지를 조회하는 api.
     *
     * @param member 로그인 한 사용자
     * @return 빌드횟수,
     */
    @GetMapping("")
    public ProfileResponse getProfile(@AuthenticationPrincipal Member member) {
        return directoryService.getProfile(member);
    }

    /**
     * 디렉토리(폴더/파일)를 생성하는 api.
     *
     * @param createRequest 상위 폴더 아이디, 폴더/파일 명, 타입(FOLDER, FILE)
     * @param member
     * @return
     */
    @PostMapping("")
    public CreateResponse createDirectory(@Valid @RequestBody CreateRequest createRequest,
                                          @AuthenticationPrincipal Member member) {
        return directoryService.createDirectory(createRequest, member);
    }
}
