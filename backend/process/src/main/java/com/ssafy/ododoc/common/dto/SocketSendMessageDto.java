package com.ssafy.ododoc.common.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class SocketSendMessageDto {
    private String dataType;
    private String data;
}
