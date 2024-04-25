package com.ssafy.ododoc.directory.service;

import com.ssafy.ododoc.directory.dto.response.ProfileResponse;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    public ProfileResponse getProfile(Member member) {
        return ProfileResponse.convertEntityToDto(member);
    }
}
