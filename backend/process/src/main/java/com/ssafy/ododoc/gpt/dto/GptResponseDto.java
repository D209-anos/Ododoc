package com.ssafy.ododoc.gpt.dto;

import com.ssafy.ododoc.gpt.data.GptChoice;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class GptResponseDto {

    private List<GptChoice> choices;
    private String id;
    private String model;
    private String object;
}
