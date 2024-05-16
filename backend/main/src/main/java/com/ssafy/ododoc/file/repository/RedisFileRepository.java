package com.ssafy.ododoc.file.repository;

import com.ssafy.ododoc.file.entity.RedisFile;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RedisFileRepository extends CrudRepository<RedisFile, Long> {

    List<RedisFile> findAll();
}
