package com.ssafy.ododoc.directory.service;

import com.ssafy.ododoc.directory.dto.request.CreateRequest;
import com.ssafy.ododoc.directory.dto.request.EditRequest;
import com.ssafy.ododoc.directory.dto.request.MoveRequest;
import com.ssafy.ododoc.directory.dto.response.*;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import com.ssafy.ododoc.directory.exception.*;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        List<DirectoryClosure> parentList = directoryClosureRepository.findAllByDescendantId(createRequest.getParentId());

        checkEmpty(parentList);

        Directory parent = parentList.getLast().getDescendant();

        // 찾은 상위 폴더의 member와 로그인 한 member가 다를 경우 예외 처리
        checkAccess(parent, member);

        // 파일인지 확인
        checkFile(parent);

        // 이미 삭제된 폴더/파일 일 경우 예외 처리
        checkIfDeleted(parent);

        Directory newDirectory = directoryRepository.save(Directory.builder()
                .name(createRequest.getName())
                .type(type)
                .member(member)
                .parent(parent)
                .build());

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
        List<DirectoryClosure> children = directoryClosureRepository.findAllByAncestorId(directoryId);

        checkEmpty(children);

        Directory directory = children.getFirst().getAncestor();

        checkAccess(directory, member);
        if(option.equals("trashbin")) {
            if(directory.getTrashbinTime() != null) {
                throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
            }
        } else {
            if(directory.getDeletedTime() != null) {
                throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
            }
        }

        if(directory.getParent() == null) {
            throw new RootDirectoryDeletionException("최상위 폴더는 삭제할 수 없습니다.");
        }

        LocalDateTime now = LocalDateTime.now();

        for(DirectoryClosure dc : children) {
            if(option.equals("trashbin")) {
                if(dc.getDescendant().getTrashbinTime() == null) {
                    dc.getDescendant().setTrashbinTime(now);
                }
            } else {
                if(dc.getDescendant().getDeletedTime() == null) {
                    if (dc.getDescendant().getTrashbinTime() == null) {
                        dc.getDescendant().setTrashbinTime(now);
                    }
                    dc.getDescendant().setDeletedTime(now);
                }
            }
        }

        if(option.equals("delete")) {
            directoryClosureRepository.deleteAllInBatch(directoryClosureRepository.deleteClosure(directoryId));
            directoryClosureRepository.flush();
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

    @Transactional
    public MoveResponse moveDirectory(MoveRequest moveRequest, Member member) {
        List<DirectoryClosure> children = directoryClosureRepository.findAllByAncestorId(moveRequest.getId());

        checkEmpty(children);

        Directory directory = children.getFirst().getAncestor();

        checkAccess(directory, member);
        checkIfDeleted(directory);

        List<DirectoryClosure> newParentList = directoryClosureRepository.findAllByDescendantId(moveRequest.getParentId());

        checkEmpty(newParentList);

        Directory newParent = newParentList.getLast().getDescendant();

        // 접근 권한 예외 처리
        checkAccess(newParent, member);

        // 파일인지 확인
        checkFile(newParent);

        // 이미 삭제된 경우 예외 처리
        checkIfDeleted(newParent);

        // 이동시킬 디렉토리의 모든 하위 디렉토리와 연관된 부모 관계 삭제
        directoryClosureRepository.deleteAll(directoryClosureRepository.moveClosure(moveRequest.getId()));
        directoryClosureRepository.flush();

        // 이동할 디렉토리에 이동시킬 디렉토리와 모든 하위 디렉토리 연결
        List<DirectoryClosure> newList = new ArrayList<>();
        for(DirectoryClosure parent : newParentList) {
            for(DirectoryClosure child : children) {
                newList.add(DirectoryClosure.builder()
                        .ancestor(parent.getAncestor())
                        .descendant(child.getDescendant())
                        .depth(parent.getDepth() + 1)
                        .build());
            }
        }

        directoryClosureRepository.saveAll(newList);

        directory.setParent(newParent);

        return MoveResponse.builder()
                .id(directory.getId())
                .newParentId(newParent.getId())
                .build();
    }

    public DirectoryResponse getDirectory(Long rootId, Member member) {
        return directoryClosureRepository.getDirectory(rootId, member);
    }

    public List<TrashbinResponse> getTrashbinDirectory(Member member) {
        List<Directory> directoryList = directoryRepository.findAllByMemberAndTrashbinTimeIsNotNullAndDeletedTimeIsNull(member);

        Map<Long, TrashbinResponse> responseMap = new HashMap<>();
        directoryList.forEach(directory -> {
            TrashbinResponse response = TrashbinResponse.builder()
                    .id(directory.getId())
                    .name(directory.getName())
                    .type(directory.getType())
                    .trashbinTime(directory.getTrashbinTime())
                    .children(new ArrayList<>())
                    .build();

            responseMap.put(directory.getId(), response);
        });

        List<TrashbinResponse> responseList = new ArrayList<>();
        directoryList.forEach(directory -> {
            if(directory.getParent() != null && directory.getParent().getTrashbinTime() != null && directory.getParent().getDeletedTime() == null) {
                TrashbinResponse parent = responseMap.get(directory.getParent().getId());
                TrashbinResponse child = responseMap.get(directory.getId());
                if(parent != null) {
                    parent.addChild(child);
                }
            } else if(directory.getParent() != null && directory.getParent().getTrashbinTime() == null && directory.getParent().getDeletedTime() == null) {
                responseList.add(responseMap.get(directory.getId()));
            }
        });

        return responseList;
    }

    @Transactional
    public RestoreResponse restoreDirectory(Long directoryId, Member member) {
        List<DirectoryClosure> children = directoryClosureRepository.findAllByAncestorId(directoryId);

        checkEmpty(children);

        Directory directory = children.getFirst().getAncestor();
        checkAccess(directory, member);

        if(directory.getTrashbinTime() == null) {
            throw new NotDeletedDirectoryException("삭제된 폴더/파일이 아닙니다.");
        }

        for(DirectoryClosure dc : children) {
            dc.getDescendant().setTrashbinTime(null);
        }

        return RestoreResponse.builder()
                .id(directory.getId())
                .trashbinTime(directory.getTrashbinTime())
                .deletedTime(directory.getDeletedTime())
                .type(directory.getType())
                .build();
    }

    private void checkEmpty(List<DirectoryClosure> list) {
        if(list.isEmpty()) {
            throw new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다.");
        }
    }

    private void checkAccess(Directory directory, Member member) {
        if(!directory.getMember().equals(member)) {
            throw new DirectoryAccessDeniedException("접근 권한이 없습니다.");
        }
    }

    private void checkFile(Directory directory) {
        if(directory.getType().equals(DirectoryType.FILE)) {
            throw new CannotCreateDirectoryException("파일에는 하위 디렉토리를 생성할 수 없습니다.");
        }
    }

    private void checkIfDeleted(Directory directory) {
        if(directory.getTrashbinTime() != null || directory.getDeletedTime() != null) {
            throw new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다.");
        }
    }
}
