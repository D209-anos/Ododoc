package com.ssafy.ododoc.process.repository;

import com.ssafy.ododoc.process.entity.CurrentStatus;
import com.ssafy.ododoc.process.type.SourceApplicationType;
import com.ssafy.ododoc.process.type.StatusType;
import org.springframework.data.repository.CrudRepository;

public interface CurrentStatusRepository extends CrudRepository<CurrentStatus, Integer>{
    CurrentStatus findFirstByConnectedFileIdAndSourceApplicationOrderByTimestamp(Long connectedFileId, SourceApplicationType sourceApplicationType);

}
