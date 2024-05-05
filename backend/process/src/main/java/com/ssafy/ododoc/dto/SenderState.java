package com.ssafy.ododoc.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class SenderState {
    private SourceApplication sourceApplication;
    private String accessToken;
}
