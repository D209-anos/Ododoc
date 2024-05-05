package com.ssafy.ododoc.data;

import lombok.Getter;

import java.time.Instant;

@Getter
public class MessageData {
    private SenderState senderState;
    private Long connectedFileId;
    private DataType dataType;
    private String contents;
    private Instant timestamp;
}
