package com.ssafy.ododoc.process.common.repository;

import com.ssafy.ododoc.process.common.entity.CurrentStatus;
import com.ssafy.ododoc.process.common.type.SourceApplicationType;
import org.springframework.data.repository.CrudRepository;

public interface CurrentStatusRepository extends CrudRepository<CurrentStatus, Integer>{
    CurrentStatus findFirstByConnectedFileIdAndSourceApplicationOrderByTimestamp(Long connectedFileId, SourceApplicationType sourceApplicationType);

}
