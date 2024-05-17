package com.ssafy.ododoc.process.chrome.service;

import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.service.SendBlockService;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@RequiredArgsConstructor
@Component
public class ChromeProcessHandler {
    private final SendBlockService sendBlockService;
    private final ChromeDataTransferService chromeDataTransferService;

    public void handle(DataType dataType, MessageRecord messageRecord) {
        switch (dataType) {
            case SIGNAL:
                System.out.println("SIGNAL");
                System.out.println(messageRecord);
                break;
            case KEYWORD:
                sendBlockService.sendRequest(chromeDataTransferService.makeKeywordBlocks(messageRecord), messageRecord);
                break;
            case SEARCH:
                sendBlockService.sendRequest(chromeDataTransferService.makeSearchBlocks(messageRecord), messageRecord);
                break;
        }
    }
}