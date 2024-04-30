package com.ssafy.ododoc.test.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TestRequest {

    private String name;
    private String address;
}
