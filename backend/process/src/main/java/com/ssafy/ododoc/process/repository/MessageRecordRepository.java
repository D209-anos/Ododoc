package com.ssafy.ododoc.process.repository;

import com.ssafy.ododoc.process.entity.MessageRecord;
import com.ssafy.ododoc.process.type.DataType;
import org.springframework.data.repository.CrudRepository;

public interface MessageRecordRepository extends CrudRepository<MessageRecord, Integer> {
    MessageRecord findByDataTypeAndConnectedFileId(DataType dataType, Long connectedFileId);
}
