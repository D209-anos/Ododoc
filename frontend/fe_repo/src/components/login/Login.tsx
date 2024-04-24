import React, { useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import menu from '../../css/components/Menu.module.css';
import axios from 'axios';

// 인가 코드 추출하는 함수
const getAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

// 인가 코드 백엔드로 전송하는 함수
const sendCodeToBackend = async (code: string) => {
    try {
        const response = await axios.post('/oauth2/authorization/{provider}', {
            code
        });
        console.log('Access Token:', response.data.data.accessToken)
        // 여기서 accessToken 받아와서 로그인 하게 하는 코드 짜야함
    } catch (error) {
        console.error('Error sending authorization code:', error)
    }
}

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const loginBackground = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const code = getAuthorizationCode();
        if (code) {
            sendCodeToBackend(code)
            console.log(code)
        }
    })

    const handleKakaoLogin = () => {
        const clientId = "6191bfdbe1eca3b27423c6d9ba50dcc0"
        const redirectUri = "http://localhost:3000/oauth"
        const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        window.location.href = kakaoLoginUrl;
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
                    <div className={`${menu.kakaoBtn} ${menu.socialLoginBtn}`} onClick={handleKakaoLogin}></div>
                </div>
            </div>
        </div>
    );
}

export default Login;