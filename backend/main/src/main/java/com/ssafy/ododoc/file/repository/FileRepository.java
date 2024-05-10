package com.ssafy.ododoc.file.repository;

import com.ssafy.ododoc.file.entity.File;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FileRepository extends MongoRepository<File, String> {

    Optional<File> findByDirectoryId(Long directoryId);
}
