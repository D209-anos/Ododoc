package com.ssafy.ododoc.directory.controller;

import com.ssafy.ododoc.directory.dto.annotation.CheckOption;
import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import com.ssafy.ododoc.directory.dto.request.EditRequest;
import com.ssafy.ododoc.directory.dto.response.CreateResponse;
import com.ssafy.ododoc.directory.dto.response.DeleteResponse;
import com.ssafy.ododoc.directory.dto.response.EditResponse;
import com.ssafy.ododoc.directory.dto.response.ProfileResponse;
import com.ssafy.ododoc.directory.service.DirectoryService;
import com.ssafy.ododoc.member.entity.Member;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author 김주이
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/directory")
@Validated
public class DirectoryController {

    private final DirectoryService directoryService;

    /**
     * 로그인 후 프로필 페이지를 조회하는 api.
     *
     * @param member 로그인 한 사용자
     * @return 빌드횟수, 에러횟수, 검색횟수, 방문횟수
     */
    @GetMapping("")
    public ProfileResponse getProfile(@AuthenticationPrincipal Member member) {
        return directoryService.getProfile(member);
    }

    /**
     * 디렉토리(폴더/파일)를 생성하는 api.
     *
     * @param createRequest 상위 폴더 아이디, 폴더/파일 명, 타입(FOLDER, FILE)
     * @param member 로그인 한 사용자
     * @return 새로 생성된 폴더/파일 아이디, 폴더/파일 명, 타입(FOLDER, FILE), 상위폴더 아이디
     */
    @PostMapping("")
    public CreateResponse createDirectory(@Valid @RequestBody CreateRequest createRequest,
                                          @AuthenticationPrincipal Member member) {
        return directoryService.createDirectory(createRequest, member);
    }

    /**
     * 휴지통 삭제 또는 영구 삭제 api.
     *
     * @param option 휴지통 삭제(trashbin) / 영구 삭제(delete)
     * @param directoryId 삭제할 폴더/파일 아이디
     * @param member 로그인 한 멤버
     * @return 삭제된 폴더/파일 정보
     */
    @DeleteMapping("/{option}/{directoryId}")
    public DeleteResponse deleteDirectory(@PathVariable @CheckOption String option,
                                          @PathVariable @Min(value = 1, message = "Directory ID는 1 이상이어야 합니다.") Long directoryId,
                                          @AuthenticationPrincipal Member member) {
        return directoryService.deleteDirectory(option, directoryId, member);
    }

    /**
     * 폴더/파일 명 수정
     *
     * @param editRequest 변경할 디렉토리 아이디, 변경할 이름
     * @param member 로그인 한 멤버
     * @return 변경된 디렉토리 아이디, 변경된 이름
     */
    @PutMapping("")
    public EditResponse editDirectory(@Valid @RequestBody EditRequest editRequest,
                                      @AuthenticationPrincipal Member member) {
        return directoryService.editDirectory(editRequest, member);
    }
}
