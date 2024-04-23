package com.ssafy.ododoc.test.service;

import com.ssafy.ododoc.test.dto.request.TestRequest;
import com.ssafy.ododoc.test.entity.Test;
import com.ssafy.ododoc.test.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;

    public List<Test> getTestByAddress(String address) {
        return testRepository.findAllByAddressContaining(address);
    }

    public List<Test> getTestByName(String name) {
        return testRepository.testFind(name);
    }

    public void saveTest(TestRequest testRequest) {
        Test save = testRepository.save(Test.builder()
                .name(testRequest.getName())
                .address(testRequest.getAddress())
                .build());

        System.out.println(save);
    }
}
