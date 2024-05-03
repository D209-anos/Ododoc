'use strict';

/** 
 * 검색 기록 및 방문 사이트 url 전송 시작 & 중지 버튼
 */
document.getElementById('startButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "startTracking" });
});

document.getElementById('stopButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "stopTracking" });
});

/**
 * 로그인 창 모달 코드
 */
document.addEventListener('DOMContentLoaded', function() {
  let loginButton = document.getElementById('loginButton');
  let modal = document.getElementById('loginModal');
  let closeButton = document.getElementsByClassName('close')[0];

  loginButton.addEventListener('click', function() {
      modal.style.display = 'block';
  });

  closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  });
});

/**
 * Oauth2 로그인 관련 코드
 */
const clientId = "YOUR_KAKAO_CLIENT_ID";
const redirectUri = encodeURIComponent("YOUR_EXTENSION_REDIRECT_URI");
const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

document.getElementById('kakaoLogin').addEventListener('click', function() {
  chrome.identity.launchWebAuthFlow({
      url: "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_EXTENSION_REDIRECT_URI&response_type=code",
      interactive: true
  }, function(redirectUrl) {
      // 인증 코드 추출
      const url = new URL(redirectUrl);
      const authCode = url.searchParams.get('code');
      console.log('Authorization code:', authCode);
      // 백엔드로 인증 코드 전송
      fetch(`https://k10d209.p.ssafy.io/api/oauth2/authorization/kakao`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: authCode, redirectUri: "YOUR_EXTENSION_REDIRECT_URI" })
      })
      .then(response => response.json())
      .then(data => {
          console.log('JWT Token:', data);
      })
      .catch(error => console.error('Error:', error));
  });
});
