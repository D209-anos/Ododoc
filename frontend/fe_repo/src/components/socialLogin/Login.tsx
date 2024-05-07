import React, { useRef, useEffect, useState } from 'react';
import { sendCodeToBackend } from '../../api/service/user';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import menu from '../../css/components/menu/Menu.module.css';
import 'animate.css';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const { accessToken, setAccessToken } = useAuth();
    const loginBackground = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();          // 리다이렉트
    const [animation, setAnimation] = useState('animate__backInDown');

    // 인가 코드 추출하는 함수
    const getAuthorizationCode = (): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    } 

    // provider 식별 함수 (카카오, 구글, 네이버)
    const getProvider = (): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('provider');
    }

    useEffect(() => {
        // 인가 코드 받아옴
        const code = getAuthorizationCode();
        const provider = getProvider();
        const redirectUri = {
            kakao: process.env.REACT_APP_KAKAO_REDIRECT_URI,
            google: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
            naver: process.env.REACT_APP_NAVER_REDIRECT_URI,
        };
        if (provider === 'kakao' || provider === 'google' || provider === 'naver' ){
            const url = redirectUri[provider]
            if (code && provider && url !== undefined) {
                sendCodeToBackend(code, url, provider, setAccessToken);
            }
        }
    }, [setAccessToken]);

    // 로그인 성공 시 editor 화면으로 이동
    useEffect(() => {
        console.log(accessToken)
        if (accessToken) {
            navigate('/editor'); 
        }
    }, [accessToken]);

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

        // URL
        const loginUrl = {
            kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${clientId.kakao}&redirect_uri=${redirectUri.kakao}&response_type=code`,
            google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId.google}&redirect_uri=${redirectUri.google}&scope=profile&response_type=code`,
            naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId.naver}&redirect_uri=${redirectUri.naver}&response_type=code`
        }
        window.location.href = loginUrl[provider];
    }

    const handleCloseClick = () => {
        setAnimation('animate__backOutUp');
        setTimeout(() => {
            onClose();
            setAnimation('animate__backInDown')
        }, 500); // 500ms 후에 onClose 콜백 실행, 애니메이션 지속 시간과 일치시켜야 함
    };

    if (!isOpen) return null;

    return (
        <div className={menu.loginContainer} ref={loginBackground} onClick={e => {
            if (e.target === loginBackground.current) {
                onClose();
            }
        }}>
            <div className={`${menu.loginContent} animate__animated ${animation} ${menu.customFaster}`}>
                <CloseIcon className={`${menu.clickable} ${menu.loginCloseBtn}`} onClick={handleCloseClick} />
                <div className={menu.loginTitleWrapper}>
                    <p className={menu.loginTitle}>Login</p>
                </div>
                <div className={menu.socialLoginBtnWrapper}>
                    <div className={`${menu.naverBtn} ${menu.socialLoginBtn}`} onClick={() => handleSocialLogin('naver')}></div>
                    <div className={`${menu.googleBtn} ${menu.socialLoginBtn}`} onClick={() => handleSocialLogin('google')}></div>
                    <div className={`${menu.kakaoBtn} ${menu.socialLoginBtn}`} onClick={() => handleSocialLogin('kakao')}></div>
                </div>
            </div>
        </div>
    );
}

export default Login;