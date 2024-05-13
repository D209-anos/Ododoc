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
import com.ssafy.ododoc.file.exception.FileBadRequestException;
import com.ssafy.ododoc.file.repository.FileRepository;
import com.ssafy.ododoc.file.type.AddType;
import com.ssafy.ododoc.member.entity.Member;
import com.ssafy.ododoc.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {

    private final DirectoryRepository directoryRepository;
    private final FileRepository fileRepository;
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

        File file = fileRepository.findByDirectoryId(directoryId)
                .orElseGet(() -> fileRepository.save(File.builder()
                        .directoryId(directoryId)
                        .content(new ArrayList<>())
                        .build()));

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .title(directory.getName())
                .content(file.getContent())
                .build();
    }

    public FileResponse saveFile(FileRequest fileRequest, Member member) {
        Directory directory = directoryRepository.findById(fileRequest.getDirectoryId())
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkDirectory(directory, member);

        File file = fileRepository.findByDirectoryId(fileRequest.getDirectoryId())
                .orElseGet(() -> fileRepository.save(File.builder()
                        .directoryId(fileRequest.getDirectoryId())
                        .content(new ArrayList<>())
                        .build()));


        List<Block> content = fileRequest.getContent().stream()
                .sorted(Comparator.comparing(block -> block.getMeta().getOrder()))
                .toList();

        file.setContent(content);

        fileRepository.save(file);

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .title(directory.getName())
                .content(file.getContent())
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
                        .content(new ArrayList<>())
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
                editMember.setSearchCount(editMember.getSearchCount() + 1);
                editMember.setVisitCount(editMember.getVisitCount() + addRequest.getVisitedCount());
            }
        }

        int lastOrder = file.getContent().getLast().getMeta().getOrder();

        lastOrder++;

        for(Block block : addRequest.getFileBlock()) {
            block.getMeta().setOrder(lastOrder++);
            file.getContent().add(block);
        }

        fileRepository.save(file);

        return FileResponse.builder()
                .directoryId(file.getDirectoryId())
                .title(directory.getName())
                .content(file.getContent())
                .build();
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
