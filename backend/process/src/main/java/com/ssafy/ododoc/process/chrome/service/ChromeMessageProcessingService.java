package com.ssafy.ododoc.process.chrome.service;

import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.repository.MessageRecordRepository;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChromeMessageProcessingService {
    private final ChromeProcessHandler chromeProcessHandler;
    private final MessageRecordRepository messageRecordRepository;
    public void handle(MessageDto messageDto) {
        MessageRecord message = messageRecordRepository.save(new MessageRecord(messageDto));

        DataType dataType = message.getDataType();

        chromeProcessHandler.handle(dataType, message);
    }
}
