package com.ssafy.ododoc.process.type;

public enum StatusType {
    WAITING, // 아무 상태도 아님
    PREPARING, // 서버 키는 상태
    RUNNING, // 서버에서 돌아가는 상태
    ERROR, // 에러
    ALGORITHM, // 알고리즘 풀고 있는 상태
    SEARCHING
}
