package com.ssafy.ododoc.process.common.repository;

import com.ssafy.ododoc.process.common.entity.MessageRecord;
import com.ssafy.ododoc.process.common.type.DataType;
import org.springframework.data.repository.CrudRepository;

public interface MessageRecordRepository extends CrudRepository<MessageRecord, Integer> {
    MessageRecord findByDataTypeAndConnectedFileId(DataType dataType, Long connectedFileId);
}
