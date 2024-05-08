package com.ssafy.ododoc.gpt.data;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GptMessage {
    private String role;
    private String content;
}
