package com.ssafy.ododoc.file.repository;

import com.ssafy.ododoc.file.entity.File;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileRepository extends MongoRepository<File, String> {

    File findByDirectoryId(Long directoryId);
}
