package com.ssafy.ododoc.member.dto;

import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class LoginDto {

    private Member member;
    private Directory directory;
}
