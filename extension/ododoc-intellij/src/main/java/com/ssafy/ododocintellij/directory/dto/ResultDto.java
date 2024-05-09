package com.ssafy.ododocintellij.directory.dto;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ResultDto {

    private int status;
    private DirectoryDto data;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public DirectoryDto getData() {
        return data;
    }

    public void setData(DirectoryDto data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ResultDto{" +
                "status=" + status +
                ", data=" + data +
                '}';
    }
}
