package com.ssafy.ododoc.file.service;

import com.ssafy.ododoc.common.util.S3Util;
import com.ssafy.ododoc.file.dto.Block;
import com.ssafy.ododoc.file.dto.request.AddRequest;
import com.ssafy.ododoc.file.dto.request.FileRequest;
import com.ssafy.ododoc.file.dto.response.FileResponse;
import com.ssafy.ododoc.file.dto.response.ImageResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.file.entity.File;
import com.ssafy.ododoc.file.entity.RedisFile;
import com.ssafy.ododoc.file.exception.FileBadRequestException;
import com.ssafy.ododoc.file.repository.FileRepository;
import com.ssafy.ododoc.file.repository.RedisFileRepository;
import com.ssafy.ododoc.file.type.AddType;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final DirectoryRepository directoryRepository;
    private final FileRepository fileRepository;
    private final RedisFileRepository redisFileRepository;
    private final S3Util s3Util;

    public ImageResponse uploadImage(Long directoryId, MultipartFile image, Member member) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkDirectory(directory, member);

        return ImageResponse.builder()
                .id(directoryId)
                .imageUrl(s3Util.uploadImage(image))
                .build();
    }

    public FileResponse getFile(Long directoryId, Member member) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkDirectory(directory, member);

        RedisFile redisFile = redisFileRepository.findById(directoryId)
                .orElseGet(() -> redisFileRepository.save(RedisFile.builder()
                        .id(directoryId)
                        .lastOrder(-1)
                        .content(new LinkedHashMap<>())
                        .build()));

        return FileResponse.builder()
                .directoryId(redisFile.getId())
                .title(directory.getName())
                .content(redisFile.getContent())
                .build();
    }

    public FileResponse saveFileInRedis(FileRequest fileRequest, Member member) {
        Directory directory = directoryRepository.findById(fileRequest.getDirectoryId())
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkDirectory(directory, member);

        RedisFile redisFile = redisFileRepository.findById(fileRequest.getDirectoryId())
                .orElseGet(() -> redisFileRepository.save(RedisFile.builder()
                        .id(fileRequest.getDirectoryId())
                        .lastOrder(-1)
                        .content(new LinkedHashMap<>())
                        .build()));

        int lastOrder = redisFile.getLastOrder();
        for(Map.Entry<String, Block> entry : fileRequest.getContent().entrySet()) {
            if(lastOrder < entry.getValue().getMeta().getOrder()) {
                lastOrder = entry.getValue().getMeta().getOrder();
            }
        }

        redisFile.setLastOrder(lastOrder);
        redisFile.setContent(fileRequest.getContent());

        redisFileRepository.save(redisFile);

        return FileResponse.builder()
                .directoryId(redisFile.getId())
                .title(directory.getName())
                .content(redisFile.getContent())
                .build();
    }

    @Transactional
    public FileResponse addFile(AddRequest addRequest, Member member) {
        log.info("addFile 시작!!!!");
        Directory directory;

        if(addRequest.getConnectedFileId() == 0L) {
            log.info("connectedFileId가 0 입니다.");
            Directory root = directoryRepository.findByMemberAndParentIsNull(member)
                    .orElseGet(() -> directoryRepository.save(Directory.builder()
                            .name(member.getNickname() + "님의 정리공간")
                            .type(DirectoryType.FOLDER)
                            .member(member)
                            .build()));

            directory = directoryRepository.findById(addRequest.getConnectedFileId())
                    .orElseGet(() -> directoryRepository.save(Directory.builder()
                            .name(LocalDate.now().toString())
                            .type(DirectoryType.FILE)
                            .member(member)
                            .parent(root)
                            .build()));
        }
        else {
            log.info("connectedFileId가 {} 입니다.", addRequest.getConnectedFileId());
            directory = directoryRepository.findById(addRequest.getConnectedFileId())
                    .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));
        }

        checkDirectory(directory, member);

        Long directoryId = directory.getId();

        log.info("directory.getId : {}", directory.getId());
        log.info("directoryId : {}", directoryId);

        RedisFile redisFile = redisFileRepository.findById(directoryId)
                .orElseGet(() -> redisFileRepository.save(RedisFile.builder()
                        .id(directoryId)
                        .lastOrder(-1)
                        .content(new LinkedHashMap<>())
                        .build()));

        log.info("redisFile : {}", redisFile);

        AddType type = AddType.valueOf(addRequest.getType().toUpperCase());
        Member editMember = directory.getMember();

        switch (type) {
            case SUCCESS -> editMember.setBuildCount(editMember.getBuildCount() + 1);
            case FAIL -> {
                editMember.setBuildCount(editMember.getBuildCount() + 1);
                editMember.setErrorCount(editMember.getErrorCount() + 1);
            }
            case KEYWORD -> editMember.setSearchCount(editMember.getSearchCount() + 1);
            case SEARCH -> editMember.setVisitCount(editMember.getVisitCount() + 1);
        }

        int lastOrder = redisFile.getLastOrder();

        lastOrder++;

        for(Map.Entry<String, Block> entry : addRequest.getFileBlock().entrySet()) {
            entry.getValue().getMeta().setOrder(lastOrder++);
            redisFile.getContent().put(entry.getKey(), entry.getValue());
        }

        redisFile.setLastOrder(lastOrder - 1);
        redisFileRepository.save(redisFile);

        return FileResponse.builder()
                .directoryId(redisFile.getId())
                .title(directory.getName())
                .content(redisFile.getContent())
                .build();
    }

    @Scheduled(fixedDelay = 1800000)
    public void saveFileInMongo() {
        List<RedisFile> redisFiles = redisFileRepository.findAll();

        if(redisFiles.isEmpty()) {
            return;
        }

        List<File> files = redisFiles.stream()
                .map(redisFile -> File.builder()
                        .directoryId(redisFile.getId())
                        .lastOrder(redisFile.getLastOrder())
                        .content(redisFile.getContent())
                        .build())
                .toList();

        Map<Long, File> mongoFiles = fileRepository.findAll().stream()
                .collect(Collectors.toMap(File::getDirectoryId, file -> file));

        for(File redis : files) {
            File mongo = mongoFiles.get(redis.getDirectoryId());
            if(mongo != null) {
                redis.setId(mongo.getId());
            }
        }

        fileRepository.saveAll(files);
    }

    private void checkDirectory(Directory directory, Member member) {
        if(directory.getType().equals(DirectoryType.FOLDER)) {
            throw new FileBadRequestException("잘못된 요청입니다.");
        }

        if(directory.getTrashbinTime() != null || directory.getDeletedTime() != null) {
            throw new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다.");
        }

        if(!directory.getMember().equals(member)) {
            throw new DirectoryAccessDeniedException("접근 권한이 없습니다.");
        }
    }
}
