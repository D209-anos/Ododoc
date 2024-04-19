'use strict';

function collectPageText() {
  // 페이지의 모든 텍스트를 수집합니다.
  let url = window.location.href;
  if (!url.includes("https://www.google.com/search?")) {

      let pageHTML = document.documentElement.innerHTML;
    
      // 백그라운드 스크립트로 수집된 텍스트 데이터를 전송합니다.
      chrome.runtime.sendMessage({ action: "sendText", html: pageHTML });

  } else {

      let searchText =  document.title;

      chrome.runtime.sendMessage({ action: "searchText", text : searchText });
  }
}

collectPageText();