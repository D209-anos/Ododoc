package com.ssafy.ododocintellij.directory.dto.response;

public class ResultDto {

    private int status;
    private DirectoryDto data;

    public int getStatus() {
        return status;
    }

    public DirectoryDto getData() {
        return data;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setData(DirectoryDto data) {
        this.data = data;
    }
}
