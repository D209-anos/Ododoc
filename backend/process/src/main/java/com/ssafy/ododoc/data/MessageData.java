package com.ssafy.ododoc.data;

import lombok.Getter;

import java.util.Date;

@Getter
public class MessageData {
    private SourceApplication sourceApplication;
    private String accessToken;
    private Long connectedFileId;
    private DataType dataType;
    private Contents contents;
    private Date timestamp;
}
