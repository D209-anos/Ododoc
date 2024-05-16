package com.ssafy.ododoc.process.vscode.service;

import com.ssafy.ododoc.process.common.dto.receive.MessageDto;
import com.ssafy.ododoc.process.common.entity.CurrentStatus;
import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.repository.CurrentStatusRepository;
import com.ssafy.ododoc.process.common.repository.MessageRecordRepository;
import com.ssafy.ododoc.process.common.service.SendBlockService;
import com.ssafy.ododoc.process.common.type.DataType;
import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import com.ssafy.ododoc.process.common.type.StatusType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

@Service
@RequiredArgsConstructor
public class VscodeMessageProcessingService {
    private final MessageRecordRepository messageRecordRepository;
    private final CurrentStatusRepository currentStatusRepository;
    private final ProcessHandler processHandler;

    public void handle(MessageDto messageDto, WebSocketSession session) {
        MessageRecord message = messageRecordRepository.save(new MessageRecord(messageDto));

        DataType dataType = message.getDataType();
        StatusType status = extractStatus(message);

        processHandler.handle(status, dataType, message, session);

    }

    private StatusType extractStatus(MessageRecord message) {
        Long connectedFileId = message.getConnectedFileId();
        SourceApplicationType sourceApplication = message.getSourceApplication();

        CurrentStatus currentStatus = currentStatusRepository.findFirstByConnectedFileIdAndSourceApplicationOrderByTimestamp(
                connectedFileId, sourceApplication);

        StatusType status = (currentStatus != null) ? currentStatus.getStatus() : null;

        if (status == null) {
            status = StatusType.WAITING;
        }

        return status;
    }
}