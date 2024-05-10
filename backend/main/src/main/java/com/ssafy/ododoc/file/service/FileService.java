package com.ssafy.ododoc.file.service;

import com.ssafy.ododoc.common.util.S3Util;
import com.ssafy.ododoc.file.dto.Block;
import com.ssafy.ododoc.file.dto.request.FileRequest;
import com.ssafy.ododoc.file.dto.response.FileResponse;
import com.ssafy.ododoc.file.dto.response.ImageResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryAlreadyDeletedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.file.entity.File;
import com.ssafy.ododoc.file.exception.FileBadRequestException;
import com.ssafy.ododoc.file.repository.FileRepository;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class FileService {

    private final DirectoryRepository directoryRepository;
    private final FileRepository fileRepository;
    private final S3Util s3Util;

    public ImageResponse uploadImage(Long directoryId, MultipartFile image, Member member) {
        checkDirectory(directoryId, member);

        return ImageResponse.builder()
                .id(directoryId)
                .imageUrl(s3Util.uploadImage(image))
                .build();
    }

    public FileResponse getFile(Long directoryId, Member member) {
        checkDirectory(directoryId, member);

        File file = fileRepository.findByDirectoryId(directoryId)
                .orElseGet(() -> fileRepository.save(File.builder()
                        .directoryId(directoryId)
                        .content(new ArrayList<>())
                        .build()));

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .content(file.getContent())
                .build();
    }

    public FileResponse saveFile(String actionType, FileRequest fileRequest, Member member) {
        checkDirectory(fileRequest.getDirectoryId(), member);

        File file = fileRepository.findByDirectoryId(fileRequest.getDirectoryId())
                .orElseGet(() -> fileRepository.save(File.builder()
                        .directoryId(fileRequest.getDirectoryId())
                        .content(new ArrayList<>())
                        .build()));

        if(actionType.toUpperCase().equals("ADD")) {
            for(Block block : fileRequest.getContent()) {
                file.getContent().add(block);
            }
        } else {
            file.setContent(fileRequest.getContent());
        }

        fileRepository.save(file);

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .content(file.getContent())
                .build();
    }

    private void checkDirectory(Long directoryId, Member member) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

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
