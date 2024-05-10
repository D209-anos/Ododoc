package com.ssafy.ododocintellij.tracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestDto {
    @JsonProperty
    private String sourceApplication;
    @JsonProperty
    private String accessToken;
    @JsonProperty
    private String dataType;
    @JsonProperty
    private long connectedFileId;
    @JsonProperty
    private String timeStamp;
    @JsonProperty
    private Object content;

    public void setSourceApplication(String sourceApplication) {
        this.sourceApplication = sourceApplication;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public void setConnectedFileId(int connectedFileId) {
        this.connectedFileId = connectedFileId;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}
