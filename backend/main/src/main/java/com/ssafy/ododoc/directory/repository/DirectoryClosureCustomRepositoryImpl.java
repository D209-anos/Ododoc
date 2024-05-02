package com.ssafy.ododoc.directory.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.directory.entity.Directory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
}
