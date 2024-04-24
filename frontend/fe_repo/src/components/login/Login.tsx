import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import menu from '../../css/components/Menu.module.css';
import axios from 'axios';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

// 인가 코드 추출하는 함수
const getAuthorizationCode = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

// 인가 코드 백엔드로 전송하는 함수
const sendCodeToBackend = async (code: string, provider: string, setAccessToken: (token: string) => void) => {
    try {
        const response = await axios.post('http://localhost:8080/oauth2/authorization/${provider}', {
            code: code, url: "http://localhost:3000"
        });
        console.log('Access Token:', response.data.data.accessToken);
        // 엑세스 토큰 상태 관리
        setAccessToken(response.data.data.accessToken);
        // 로컬 스토리지에 토큰 저장
        localStorage.setItem('accessToken', response.data.data.accessToken);
    } catch (error) {
        console.error('Error sending authorization code:', error)
    }
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const loginBackground = useRef<HTMLDivElement>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);        // 토큰 상태 관리
    const navigate = useNavigate();          // 리다이렉트

    useEffect(() => {
        // 인가 코드 받아옴
        const code = getAuthorizationCode();
        if (code) {
            console.log(code)
            sendCodeToBackend(code, 'kakao', setAccessToken);
        }
    }, [setAccessToken]);

    // 로그인 성공 시 Home 화면으로 이동
    useEffect(() => {
        if (accessToken) {
            navigate('/'); 
        }
    }, [accessToken, navigate]);

    const handleSocialLogin = (provider: 'kakao' | 'google' | 'naver') => {
        const clientId = {
            kakao: "6191bfdbe1eca3b27423c6d9ba50dcc0",
            google: "your-google-client-id",
            naver: "your-naver-client-id"
        };
        const redirectUri = "http://localhost:3000/oauth"
        // 카카오 로그인 URL
        const loginUrl = {
            kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${clientId.kakao}&redirect_uri=${redirectUri}&response_type=code`,
            google: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId.google}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&access_type=offline`,
            naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId.naver}&redirect_uri=${redirectUri}&response_type=code`
        }
        
        window.location.href = loginUrl[provider];
    }

    if (!isOpen) return null;

    return (
        <div className={menu.loginContainer} ref={loginBackground} onClick={e => {
            if (e.target === loginBackground.current) {
                onClose();
            }
        }}>
            <div className={menu.loginContent}>
                <div className={menu.loginTitleWrapper}>
                    <p className={menu.loginTitle}>Login</p>
                    <CloseIcon className={`${menu.clickable} ${menu.loginCloseBtn}`} onClick={onClose} />
                </div>
                <div className={menu.socialLoginBtnWrapper}>
                    <div className={`${menu.naverBtn} ${menu.socialLoginBtn}`}></div>
                    <div className={`${menu.googleBtn} ${menu.socialLoginBtn}`}></div>
                    <div className={`${menu.kakaoBtn} ${menu.socialLoginBtn}`} onClick={() => handleSocialLogin('kakao')}></div>
                </div>
            </div>
        </div>
    );
}

export default Login;