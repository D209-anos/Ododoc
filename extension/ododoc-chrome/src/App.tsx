import React, { useRef, useEffect, useState } from 'react';
import './css/login/login.css';
import Sidebar from './components/sidebar/Sidebar';
import './css/directory/directory.css'
import { logout } from './service/user';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FileProvider } from './contexts/FileContext';
import OdodocMain from './images/icon/ododocLogo.gif'

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null); 
  const [folderTitle, setFolderTitle] = useState<string | null>(null); 
  const [rootId, setRootId] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 로드 시 실행되는 로직
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');
    const provider = urlParams.get('provider');
    const rootId = urlParams.get('rootId');
    const title = urlParams.get("title");

    const token = localStorage.getItem('accessToken');
    const root = localStorage.getItem('rootId');
    const storeName = localStorage.getItem('title');

    if (title) {
      const decodedTitle = decodeURIComponent(title);
      setFolderTitle(decodedTitle)
      console.log('Decoded Title:', folderTitle);
    }

    if (accessToken && provider && rootId && title) {
      setAccessToken(accessToken); // 상태 업데이트
      setRootId(rootId);
      localStorage.setItem('accessToken', accessToken); // 로컬 스토리지 저장
      localStorage.setItem('provider', provider);
      localStorage.setItem('rootId', rootId);
      localStorage.setItem('title', title);
      chrome.storage.local.set({accessToken: accessToken, rootId: rootId, title: title})
      window.close(); // 로그인 창 닫기
    } else if (token) { // 로컬 스토리지에 토큰이 있을 경우 (팝업 창)
      setAccessToken(token);
      setFolderTitle(storeName)
      setRootId(root)
    }
  }, []);

  const handleSocialLogin = (provider: 'kakao' | 'google' | 'naver') => {
    console.log("로그인 버튼 눌렀다.")
    const clientId = {
        kakao: process.env.REACT_APP_KAKAO_CLIENT_ID,
        google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        naver: process.env.REACT_APP_NAVER_CLIENT_ID
    };

    const extensionId = chrome.runtime.id;

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
    localStorage.removeItem('provider')
    localStorage.removeItem('rootId')
    localStorage.removeItem('title')

  }

  return (
    <AuthProvider>
      <div>
        {!accessToken ? (
          <div className="loginContent">
            <div className="loginTitleWrapper">
              <img src={OdodocMain} className='loginimage' alt="" />
            </div>
            <div className="socialLoginBtnWrapper">
              <div className="naverBtn socialLoginBtn" onClick={() => handleSocialLogin('naver')}></div>
              <div className="googleBtn socialLoginBtn" onClick={() => handleSocialLogin('google')}></div>
              <div className="kakaoBtn socialLoginBtn" onClick={() => handleSocialLogin('kakao')}></div>
            </div>
          </div>
        ) : (
          <div>
            <FileProvider>
              <Sidebar accessToken={accessToken} rootId={Number(rootId)} title={folderTitle} onLogout={handleLogout} />
            </FileProvider>
          </div>
        )}
      </div>
    </AuthProvider>
  );
};

export default App;