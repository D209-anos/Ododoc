package com.ssafy.ododoc.directory.controller;

import com.ssafy.ododoc.directory.dto.response.ProfileResponse;
import com.ssafy.ododoc.directory.service.DirectoryService;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/directory")
public class DirectoryController {

    private final DirectoryService directoryService;

    @GetMapping("")
    public ProfileResponse getProfile(@AuthenticationPrincipal Member member) {
        return directoryService.getProfile(member);
    }
}
