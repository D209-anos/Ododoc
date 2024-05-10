package com.ssafy.ododoc.test.controller;

import com.ssafy.ododoc.common.dto.response.StringWrapper;
import com.ssafy.ododoc.member.exception.TokenInvalidException;
import com.ssafy.ododoc.test.dto.request.TestRequest;
import com.ssafy.ododoc.test.entity.Test;
import com.ssafy.ododoc.test.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final TestService testService;

    @GetMapping("/hello/{name}")
    public StringWrapper hello(@PathVariable String name) {
        return StringWrapper.wrap("Hello " + name);
    }

    @GetMapping("/jpa/{address}")
    public List<Test> jpaTest(@PathVariable String address) {
        return testService.getTestByAddress(address);
    }

    @GetMapping("/querydsl/{name}")
    public List<Test> queryDslTest(@PathVariable String name) {
        return testService.getTestByName(name);
    }

    @GetMapping("/exceptional")
    public void exceptionHandlerTest() {
        throw new TokenInvalidException("예외 테스트");
    }

    @PostMapping("/save")
    public void saveTest(@RequestBody TestRequest testRequest) {
        testService.saveTest(testRequest);
    }
}
