package com.ssafy.ododoc.directory.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.directory.dto.response.DirectoryResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssafy.ododoc.directory.entity.QDirectory.directory;
import static com.ssafy.ododoc.directory.entity.QDirectoryClosure.directoryClosure;

@RequiredArgsConstructor
@Slf4j
public class DirectoryClosureCustomRepositoryImpl implements DirectoryClosureCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public void deleteClosure(Directory moveDirectory) {
        JPQLQuery<Directory> children = JPAExpressions.select(directoryClosure.descendant)
                .from(directoryClosure)
                .where(directoryClosure.ancestor.eq(moveDirectory));

        JPQLQuery<Directory> parentList = JPAExpressions.select(directoryClosure.ancestor)
                .from(directoryClosure)
                .where(directoryClosure.descendant.eq(moveDirectory).and(directoryClosure.ancestor.ne(moveDirectory)));

        jpaQueryFactory.delete(directoryClosure)
                .where(directoryClosure.ancestor.in(parentList).and(directoryClosure.descendant.in(children)));
    }

    @Override
    public DirectoryResponse getDirectory(Long rootId, Member member) {
        JPQLQuery<Directory> children = JPAExpressions.select(directoryClosure.descendant)
                .from(directoryClosure)
                .where(directoryClosure.ancestor.id.eq(rootId));

        List<Directory> directories = jpaQueryFactory.select(directory)
                .from(directory)
                .where(directory.in(children).and(directory.trashbinTime.isNull()).and(directory.deletedTime.isNull()))
                .fetch();

        if(directories.isEmpty()) {
            throw new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다.");
        }

        if(!directories.getFirst().getMember().equals(member)) {
            throw new DirectoryAccessDeniedException("접근 권한이 없습니다.");
        }

        Map<Long, DirectoryResponse> responseMap = new HashMap<>();
        directories.forEach(directory -> {
            DirectoryResponse response = DirectoryResponse.builder()
                    .id(directory.getId())
                    .name(directory.getName())
                    .type(directory.getType())
                    .children(new ArrayList<>())
                    .build();

            responseMap.put(directory.getId(), response);
        });

        directories.forEach(directory -> {
            if(directory.getParent() != null) {
                DirectoryResponse parent = responseMap.get(directory.getParent().getId());
                DirectoryResponse child = responseMap.get(directory.getId());
                if(parent != null) {
                    parent.addChild(child);
                }
            }
        });

        return responseMap.get(rootId);
    }
}
