'use strict';

chrome.action.onClicked.addListener(function(tab) {
  chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 350,  // 원하는 너비
      height: 300,  // 원하는 높이
      left: 100,  // 원하는 위치에 따라 조절
      top: 100   // 원하는 위치에 따라 조절
  });
});



let tabTimes = {};

chrome.tabs.onActivated.addListener(activeInfo => {
    // 활성 탭 변경 시 현재 탭의 정보와 함께 시간을 기록
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        recordStartTime(tab.id, tab.url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 탭 URL이 변경되고 페이지 로드가 완료되었을 때 시간을 기록
    if (changeInfo.url) {
        if (tabTimes[tabId] && tabTimes[tabId].startTime) {
            calculateTimeSpent(tabId, tabTimes[tabId].url); // 이전 페이지에서 머문 시간 계산
        }
        recordStartTime(tabId, changeInfo.url); // 새 URL의 시작 시간 기록
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    // 탭이 닫힐 때 그 탭의 머문 시간을 계산
    if (tabTimes[tabId]) {
        calculateTimeSpent(tabId, tabTimes[tabId].url);
        delete tabTimes[tabId]; // 사용된 탭 정보 삭제
    }
});

function recordStartTime(tabId, url) {
    tabTimes[tabId] = {
        startTime: Date.now(),
        url: url
    };
    console.log(`Tab ${tabId} started at ${tabTimes[tabId].startTime} on ${url}`);
}

function calculateTimeSpent(tabId, url) {
    const endTime = Date.now();
    const timeSpent = endTime - tabTimes[tabId].startTime;
    console.log(`Tab ${tabId} spent ${timeSpent / 1000} seconds on ${url}`);

    const time = timeSpent/1000
    // 여기서 timeSpent 값을 서버로 보내거나 다른 처리를 할 수 있습니다.
    fetch('http://localhost:8080/api/time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: time }),
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

