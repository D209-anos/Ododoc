package com.ssafy.ododoc.common.service;

import com.ssafy.ododoc.file.entity.RedisFile;
import com.ssafy.ododoc.file.repository.FileRepository;
import com.ssafy.ododoc.file.repository.RedisFileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RedisInitializationService implements ApplicationRunner {

    @Lazy
    @Autowired
    private RedisFileRepository redisFileRepository;

    @Lazy
    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    @Autowired
    private FileRepository fileRepository;

    @Override
    public void run(ApplicationArguments args) {
        initializeRedis();
    }

    public void initializeRedis() {
        try {
            if(redisConnectionFactory.getConnection().ping().equals("PONG")) {
                saveMongoDataToRedis();
            }
        } catch (Exception e) {
            log.debug("Redis 연결 중 에러 발생 : {}", e.getMessage());
        }
    }

    private void saveMongoDataToRedis() {
        List<RedisFile> redisFiles = fileRepository.findAll().stream()
                .map(file -> RedisFile.builder()
                        .id(file.getDirectoryId())
                        .lastOrder(file.getLastOrder())
                        .content(file.getContent())
                        .build())
                .toList();

        redisFileRepository.saveAll(redisFiles);
    }
}
