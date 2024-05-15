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
import com.ssafy.ododoc.file.exception.VisitCountNotNullException;
import com.ssafy.ododoc.file.repository.FileRepository;
import com.ssafy.ododoc.file.repository.RedisFileRepository;
import com.ssafy.ododoc.file.type.AddType;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
                        .content(new LinkedHashMap<>())
                        .build()));

        LinkedHashMap<String, Block> content = fileRequest.getContent().entrySet().stream()
                .sorted(Comparator.comparingInt(e -> e.getValue().getMeta().getOrder()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new
                ));

        redisFile.setContent(content);

        redisFileRepository.save(redisFile);

        return FileResponse.builder()
                .directoryId(redisFile.getId())
                .title(directory.getName())
                .content(redisFile.getContent())
                .build();
    }

    @Transactional
    public FileResponse addFile(AddRequest addRequest, Member member) {
        Directory directory = directoryRepository.findById(addRequest.getConnectedFileId())
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkDirectory(directory, member);

        File file = fileRepository.findByDirectoryId(addRequest.getConnectedFileId())
                .orElseGet(() -> fileRepository.save(File.builder()
                        .directoryId(addRequest.getConnectedFileId())
                        .content(new LinkedHashMap<>())
                        .build()));

        AddType type = AddType.valueOf(addRequest.getType().toUpperCase());
        Member editMember = directory.getMember();

        switch (type) {
            case SUCCESS -> editMember.setBuildCount(editMember.getBuildCount() + 1);
            case FAIL -> {
                editMember.setBuildCount(editMember.getBuildCount() + 1);
                editMember.setErrorCount(editMember.getErrorCount() + 1);
            }
            case SEARCH -> {
                if(addRequest.getVisitedCount() == null) {
                    throw new VisitCountNotNullException("type이 search인 경우 visitCount는 null일 수 없습니다.");
                }

                editMember.setSearchCount(editMember.getSearchCount() + 1);
                editMember.setVisitCount(editMember.getVisitCount() + addRequest.getVisitedCount());
            }
        }

        int lastOrder = 0;

        for(Map.Entry<String, Block> entry : file.getContent().entrySet()) {
            if(lastOrder < entry.getValue().getMeta().getOrder()) {
                lastOrder = entry.getValue().getMeta().getOrder();
            }
        }

        if(lastOrder != 0) {
            lastOrder++;
        }

        for(Map.Entry<String, Block> entry : addRequest.getFileBlock().entrySet()) {
            entry.getValue().getMeta().setOrder(lastOrder++);
            file.getContent().put(entry.getKey(), entry.getValue());
        }

        fileRepository.save(file);

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .title(directory.getName())
                .content(file.getContent())
                .build();
    }

    @Scheduled(fixedDelay = 1800000)
    public void saveFileInMongo() {
        List<File> redisFiles = redisFileRepository.findAll().stream()
                .map(redisFile -> File.builder()
                        .directoryId(redisFile.getId())
                        .content(redisFile.getContent())
                        .build())
                .toList();

        Map<Long, File> mongoFiles = fileRepository.findAll().stream()
                .collect(Collectors.toMap(File::getDirectoryId, file -> file));

        for(File redis : redisFiles) {
            File mongo = mongoFiles.get(redis.getDirectoryId());
            if(mongo != null) {
                redis.setId(mongo.getId());
            }
        }

        fileRepository.saveAll(redisFiles);
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
