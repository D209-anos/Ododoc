package com.ssafy.ododoc.directory.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.directory.dto.response.DirectoryResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import com.ssafy.ododoc.directory.entity.QDirectoryClosure;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssafy.ododoc.directory.entity.QDirectory.directory;
import static com.ssafy.ododoc.directory.entity.QDirectoryClosure.directoryClosure;

@RequiredArgsConstructor
public class DirectoryClosureCustomRepositoryImpl implements DirectoryClosureCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<DirectoryClosure> deleteClosure(Long directoryId) {
        QDirectoryClosure dc1 = new QDirectoryClosure("dc1");
        QDirectoryClosure dc2 = new QDirectoryClosure("dc2");

        JPQLQuery<Long> children = JPAExpressions.select(dc2.descendant.id)
                .from(dc2)
                .where(dc2.ancestor.id.eq(directoryId));

        List<DirectoryClosure> listTest = jpaQueryFactory.selectFrom(dc1)
                .where(dc1.descendant.id.in(children))
                .fetch();

        return listTest;
    }

    @Override
    public List<DirectoryClosure> moveClosure(Long directoryId) {
        QDirectoryClosure dc1 = new QDirectoryClosure("dc1");
        QDirectoryClosure dc2 = new QDirectoryClosure("dc2");
        QDirectoryClosure dc3 = new QDirectoryClosure("dc3");

        JPQLQuery<Long> childrenIds = JPAExpressions.select(dc2.descendant.id)
                .from(dc2)
                .where(dc2.ancestor.id.eq(directoryId));

        JPQLQuery<Long> parentIdList = JPAExpressions.select(dc3.ancestor.id)
                .from(dc3)
                .where(dc3.descendant.id.eq(directoryId).and(dc3.ancestor.id.ne(directoryId)));

        return jpaQueryFactory.selectFrom(dc1)
                .where(dc1.descendant.id.in(childrenIds).and(dc1.ancestor.id.in(parentIdList)))
                .fetch();
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
