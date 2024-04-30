package com.ssafy.ododoc.directory.service;

import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import com.ssafy.ododoc.directory.dto.request.EditRequest;
import com.ssafy.ododoc.directory.dto.request.MoveRequest;
import com.ssafy.ododoc.directory.dto.response.*;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryAlreadyDeletedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.directory.exception.RootDirectoryDeletionException;
import com.ssafy.ododoc.directory.repository.DirectoryClosureRepository;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final DirectoryRepository directoryRepository;
    private final DirectoryClosureRepository directoryClosureRepository;

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

        // 폴더/파일 default name 설정
        if(createRequest.getName().isBlank()) {
            createRequest.setName(type.equals(DirectoryType.FOLDER) ? "새 폴더" : LocalDate.now().toString());
        }

        // 상위 폴더 찾고 없을 경우 예외 처리
        Directory parent = directoryRepository.findById(createRequest.getParentId())
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더를 찾을 수 없습니다."));

        // 찾은 상위 폴더의 member와 로그인 한 member가 다를 경우 예외 처리
        checkAccess(parent, member);

        // 이미 삭제된 폴더/파일 일 경우 예외 처리
        checkIfDeleted(parent);

        Directory newDirectory = directoryRepository.save(Directory.builder()
                .name(createRequest.getName())
                .type(type)
                .member(member)
                .parent(parent)
                .build());

        List<DirectoryClosure> parentList = directoryClosureRepository.findAllByDescendant(parent);

        List<DirectoryClosure> closures = new ArrayList<>();
        for(DirectoryClosure dc : parentList) {
            closures.add(DirectoryClosure.builder()
                    .ancestor(dc.getAncestor())
                    .descendant(newDirectory)
                    .depth(dc.getDepth() + 1)
                    .build());
        }

        closures.add(DirectoryClosure.builder()
                .ancestor(newDirectory)
                .descendant(newDirectory)
                .build());

        directoryClosureRepository.saveAll(closures);

        return CreateResponse.builder()
                .id(newDirectory.getId())
                .name(newDirectory.getName())
                .type(newDirectory.getType())
                .parentId(newDirectory.getParent().getId())
                .build();
    }

    @Transactional
    public DeleteResponse deleteDirectory(String option, Long directoryId, Member member) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkAccess(directory, member);

        LocalDateTime now = LocalDateTime.now();

        if(directory.getParent() == null) {
            throw new RootDirectoryDeletionException("최상위 폴더는 삭제할 수 없습니다.");
        }

        List<DirectoryClosure> children = directoryClosureRepository.findAllByAncestor(directory);
        for(DirectoryClosure dc : children) {
            if(option.equals("trashbin")) {
                if(dc.getDescendant().getTrashbinTime() != null) {
                    throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
                }
                dc.getDescendant().setTrashbinTime(now);
            } else {
                if(dc.getDescendant().getDeletedTime() != null) {
                    throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
                }
                if(dc.getDescendant().getTrashbinTime() == null) {
                    dc.getDescendant().setTrashbinTime(now);
                }
                dc.getDescendant().setDeletedTime(now);
            }
        }

        return DeleteResponse.builder()
                .id(directoryId)
                .trashbinTime(directory.getTrashbinTime())
                .deletedTime(directory.getDeletedTime())
                .type(directory.getType())
                .build();
    }

    @Transactional
    public EditResponse editDirectory(EditRequest editRequest, Member member) {
        Directory directory = directoryRepository.findById(editRequest.getId())
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        checkAccess(directory, member);
        checkIfDeleted(directory);

        directory.setName(editRequest.getName());

        return EditResponse.builder()
                .id(directory.getId())
                .name(directory.getName())
                .build();
    }

    private void checkAccess(Directory directory, Member member) {
        if(!directory.getMember().equals(member)) {
            throw new DirectoryAccessDeniedException("접근 권한이 없습니다.");
        }
    }

    private void checkIfDeleted(Directory directory) {
        if(directory.getTrashbinTime() != null || directory.getDeletedTime() != null) {
            throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
        }
    }
}
