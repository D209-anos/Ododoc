import React from 'react';
import CountUp from 'react-countup';

function Mypage() {
    const errorCount = 50; // 예시 데이터
    const websiteVisits = 150;
    const builds = 30;
    const keywordSearches = 70;

    const totalCount = errorCount + websiteVisits + builds + keywordSearches;

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>현재님의 개발 경험치</h1>
            <CountUp
                end={totalCount}
                duration={2.75}
                separator=","
                suffix="  EXP"
                style={{ fontSize: '10rem', color: 'orange' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <div>
                    <h2>에러 발견</h2>
                    <CountUp end={errorCount} duration={2.75} separator="," />
                </div>
                <div>
                    <h2>사이트 방문</h2>
                    <CountUp end={websiteVisits} duration={2.75} separator="," />
                </div>
                <div>
                    <h2>빌드 성공</h2>
                    <CountUp end={builds} duration={2.75} separator="," />
                </div>
                <div>
                    <h2>검색 횟수</h2>
                    <CountUp end={keywordSearches} duration={2.75} separator="," />
                </div>
            </div>
        </div>
    );
}


export default Mypage;