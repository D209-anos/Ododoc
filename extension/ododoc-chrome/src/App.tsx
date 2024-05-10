import React, { useRef, useEffect, useState } from 'react';
import { sendCodeToBackend } from './service/user';
import './css/login/login.css';
import { sendChromeMessage, setupWebSocket } from './components/textCollect/chromeMessage';
import Sidebar from './components/sidebar/Sidebar';
import './css/directory/directory.css'
import { logout } from './service/user';

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null); 
  
  // const [collectStart, setCollectStart] = useState<boolean>(false); 

  // 웹소켓 설정
  // useEffect(() => {
  //   const socket = setupWebSocket();
  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // useEffect(() => {
  //   sendChromeMessage('collectStatus', { collectStart });
  // }, [collectStart]);

  useEffect(() => {
    // 페이지 로드 시 실행되는 로직
    const token = localStorage.getItem('accessToken');
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');
    const provider = urlParams.get('provider');

    if (accessToken && provider) {
      setAccessToken(accessToken); // 상태 업데이트
      localStorage.setItem('accessToken', accessToken); // 로컬 스토리지 저장
      window.close(); // 로그인 창 닫기
    } else if (token) { // 로컬 스토리지에 토큰이 있을 경우 (팝업 창)
      setAccessToken(token);
    }
  }, []);

  const handleSocialLogin = (provider: 'kakao' | 'google' | 'naver') => {
    console.log("로그인 버튼 눌렀다.")
    const clientId = {
        kakao: process.env.REACT_APP_KAKAO_CLIENT_ID,
        google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        naver: process.env.REACT_APP_NAVER_CLIENT_ID
    };

    const redirectUri = {
        kakao: process.env.REACT_APP_KAKAO_REDIRECT_URI,
        google: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
        naver: process.env.REACT_APP_NAVER_REDIRECT_URI,
    };
    
    console.log(redirectUri)
    // URL
    const loginUrl = {
        kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${clientId.kakao}&redirect_uri=${redirectUri.kakao}&response_type=code`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId.google}&redirect_uri=${redirectUri.google}&scope=profile&response_type=code`,
        naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId.naver}&redirect_uri=${redirectUri.naver}&response_type=code`
    }
    console.log("로그인 창으로 가기 직전")
    // window.location.href = loginUrl[provider];
    window.open(loginUrl[provider], '_blank');
  }

  const handleLogout = async() => {
    await logout()
    setAccessToken(null);
    localStorage.removeItem('accessToken')

  }

  return (
    <div>
      {!accessToken ? (
        <div className="loginContent">
          <div className="loginTitleWrapper">
            <p className="loginTitle">Login</p>
          </div>
          <div className="socialLoginBtnWrapper">
            <div className="naverBtn socialLoginBtn" onClick={() => handleSocialLogin('naver')}></div>
            <div className="googleBtn socialLoginBtn" onClick={() => handleSocialLogin('google')}></div>
            <div className="kakaoBtn socialLoginBtn" onClick={() => handleSocialLogin('kakao')}></div>
          </div>
        </div>
      ) : (
        <div>
          <Sidebar />
          <div className="buttons-container">
            <button>Start</button>
            <button>Stop</button>
            <div className="menu.loginOpenBtn" onClick={handleLogout}>Logout</div>
          </div>
          {/* <button onClick={() => setCollectStart(true)}>Start</button>
          <button onClick={() => setCollectStart(false)}>Stop</button> */}
          {/* 로그인 후 보여줄 컨텐츠 */}
        </div>
      )}
    </div>
  );
};

export default App;