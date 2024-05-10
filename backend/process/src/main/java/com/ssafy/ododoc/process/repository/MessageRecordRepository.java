package com.ssafy.ododoc.process.repository;

import com.ssafy.ododoc.process.dto.receive.MessageDto;
import com.ssafy.ododoc.process.entity.PMessage;
import com.ssafy.ododoc.process.type.DataType;
import org.springframework.data.repository.CrudRepository;

public interface PMessageRecordRepository extends CrudRepository<PMessage, Integer> {

    MessageDto findByDataTypeAndConnectedFileId(DataType dataType, long connectedFileId);
}
