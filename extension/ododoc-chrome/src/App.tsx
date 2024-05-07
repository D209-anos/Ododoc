import React, { useState, useEffect } from 'react';
import { sendCodeToBackend } from './service/user';
import './css/login/login.css';
import { sendChromeMessage, setupWebSocket } from './components/textCollect/chromeMessage';


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

  // 인가 코드 추출하는 함수
  const getAuthorizationCode = (): string | null => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('code');
  } 

  // provider 식별 함수
  const getProvider = (): string | null => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('provider');
  }

  useEffect(() => {
      // 인가 코드 받아옴
      const code = getAuthorizationCode();
      const provider = getProvider();
      if (code && provider) {
          sendCodeToBackend(code, provider, setAccessToken);
          console.log(code, provider)
      }
  }, [setAccessToken]);

  const handleSocialLogin = (provider: 'kakao' | 'google' | 'naver') => {
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

    // 네이버 로그인 stateString 부분 - 필요시 교체
    // const stateString = "SM6HMQOM5D"
    // naverUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId.naver}&response_type=code&redirect_uri=${redirectUri.naver}&state=${stateString}`

    // 카카오 로그인 URL
    const loginUrl = {
        kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${clientId.kakao}&redirect_uri=${redirectUri.kakao}&response_type=code`,
        google: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId.google}&redirect_uri=${redirectUri.google}?provider=&response_type=code&scope=profile email&access_type=offline`,
        naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId.naver}&redirect_uri=${redirectUri.naver}?provider=&response_type=code`
    }
    window.location.href = loginUrl[provider];
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
          {/* <button onClick={() => setCollectStart(true)}>Start</button> */}
          {/* <button onClick={() => setCollectStart(false)}>Stop</button>    */}
          {/* 로그인 후 보여줄 컨텐츠 */}
        </div>
      )}
    </div>
  );
};

export default App;