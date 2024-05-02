package com.ssafy.ododoc.test.repository;

import com.ssafy.ododoc.test.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long>, TestCustomRepository {

    List<Test> findAllByAddressContaining(String address);
}
