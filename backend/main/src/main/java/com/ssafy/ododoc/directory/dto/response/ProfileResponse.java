package com.ssafy.ododoc.directory.dto.response;

import com.ssafy.ododoc.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProfileResponse {

    private Long buildCount;
    private Long errorCount;
    private Long visitCount;
    private Long searchCount;
}
