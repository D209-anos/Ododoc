package com.ssafy.ododoc.test.repository;

import com.ssafy.ododoc.test.entity.Test;

import java.util.List;

public interface TestCustomRepository {

    List<Test> testFind(String name);
}
