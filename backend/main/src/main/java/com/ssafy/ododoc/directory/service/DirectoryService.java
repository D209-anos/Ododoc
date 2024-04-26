package com.ssafy.ododoc.directory.service;

import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import com.ssafy.ododoc.directory.dto.response.CreateResponse;
import com.ssafy.ododoc.directory.dto.response.ProfileResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.exception.FileParentNullException;
import com.ssafy.ododoc.directory.exception.FolderAccessDeniedException;
import com.ssafy.ododoc.directory.exception.FolderGoneException;
import com.ssafy.ododoc.directory.exception.ParentNotFoundException;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final DirectoryRepository directoryRepository;

    public ProfileResponse getProfile(Member member) {
        return ProfileResponse.builder()
                .buildCount(member.getBuildCount())
                .errorCount(member.getErrorCount())
                .visitCount(member.getVisitCount())
                .searchCount(member.getSearchCount())
                .build();
    }

    public CreateResponse createDirectory(CreateRequest createRequest, Member member) {
        DirectoryType type = DirectoryType.valueOf(createRequest.getType().toUpperCase());

        // 파일인데 상위 폴더가 없는 경우 예외 처리
        if(type.equals(DirectoryType.FILE) && createRequest.getParentId() == null) {
            throw new FileParentNullException("파일은 상위 폴더 내에 위치해야 합니다.");
        }

        // 폴더/파일 default name 설정
        if(type.equals(DirectoryType.FOLDER) && createRequest.getName().isBlank()) {
            createRequest.setName("새 폴더");
        }
        else if(type.equals(DirectoryType.FILE) && createRequest.getName().isBlank()) {
            createRequest.setName(LocalDate.now().toString());
        }

        // 폴더이고 상위 폴더가 없을 경우 db에 저장 후 return
        if(createRequest.getParentId() == null) {
            Directory newDirectory = directoryRepository.save(Directory.builder()
                    .name(createRequest.getName())
                    .type(type)
                    .member(member)
                    .build());

            return CreateResponse.builder()
                    .id(newDirectory.getId())
                    .name(newDirectory.getName())
                    .type(newDirectory.getType())
                    .parentId(null)
                    .build();
        }

        // 상위 폴더 찾고 없을 경우 예외 처리
        Directory parent = directoryRepository.findById(createRequest.getParentId())
                .orElseThrow(() -> new ParentNotFoundException("해당하는 폴더를 찾을 수 없습니다."));

        // 찾은 상위 폴더의 member와 로그인 한 member가 다를 경우 예외 처리
        if(!parent.getMember().equals(member)) {
            throw new FolderAccessDeniedException("접근 권한이 없습니다.");
        }

        // 이미 삭제된 폴더/파일 일 경우 예외 처리
        if(parent.getTrashbinTime() != null || parent.getDeletedTime() != null) {
            throw new FolderGoneException("삭제된 폴더입니다.");
        }

        // db에 저장 후 return
        Directory newDirectory = directoryRepository.save(Directory.builder()
                .name(createRequest.getName())
                .type(type)
                .member(member)
                .parent(parent)
                .build());

        return CreateResponse.builder()
                .id(newDirectory.getId())
                .name(newDirectory.getName())
                .type(newDirectory.getType())
                .parentId(newDirectory.getParent().getId())
                .build();
    }
}
