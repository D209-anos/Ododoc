package com.ssafy.ododoc.dto;

import java.time.LocalDateTime;

public class MessageData {
    private SenderState senderState;
    private Long connectedFileId;
    private DataType dataType;
    private String contents;
    private LocalDateTime timestamp;

}
