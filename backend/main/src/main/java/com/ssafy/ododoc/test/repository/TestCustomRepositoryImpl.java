package com.ssafy.ododoc.test.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ododoc.test.entity.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.ododoc.test.entity.QTest.test;

@Repository
@RequiredArgsConstructor
public class TestCustomRepositoryImpl implements TestCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<Test> testFind(String name) {
        return jpaQueryFactory.selectFrom(test)
                .where(test.name.eq(name))
                .fetch();
    }
}
