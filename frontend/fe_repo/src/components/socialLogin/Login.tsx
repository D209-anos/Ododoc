import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import { sendCodeToBackend } from '../../api/service/user';
import menu from '../../css/components/menu/Menu.module.css';
import 'animate.css';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const loginBackground = useRef<HTMLDivElement>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);        // 토큰 상태 관리
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
        if (code && provider) {
            sendCodeToBackend(code, provider, setAccessToken);
            console.log(code, provider)
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
            google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId.google}&redirect_uri=${redirectUri.google}&response_type=code&scope=profile%20email&access_type=offline`,
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