package com.ssafy.ododoc.directory.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ImageResponse {

    private Long id;
    private String imageUrl;
}
