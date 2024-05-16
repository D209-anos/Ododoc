package com.ssafy.ododoc.process.common.type;

public enum StatusType {
    WAITING, // 아무 상태도 아님
    RUNNING, // 프로그램 실행 상태
    TROUBLED, // 에러
    ALGORITHM, // 알고리즘 풀고 있는 상태
}
