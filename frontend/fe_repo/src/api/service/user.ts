import api from '../instances/api';
import Cookies from 'js-cookie';
import { useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';


// 인가 코드 백엔드로 전송
export const useSendCodeToBackend = () => {
    const { dispatch } = useAuth();

    const sendCodeToBackend = useCallback(async(code: string, url: string, provider: string) => {
        try {
            const response = await api.post(`/oauth2/authorization/${provider}`, {
                code: code,
                url: url
            });
            console.log('Login Info:', response.data);

            const { accessToken, refreshToken, rootId, title, type } = response.data.data;
            // 상태 업데이트
            dispatch({ type: 'SET_AUTH_DETAILS', payload: { accessToken, refreshToken, rootId, title, type } });
            localStorage.setItem('authDetails', JSON.stringify({ accessToken, refreshToken, rootId, title, type }))
            // Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
        } catch (error) {
            console.error('Error sending authorization code:', error);
        }
    }, [dispatch]);

    return sendCodeToBackend;
};

// 로그아웃
export const useLogout = () => {
    const { dispatch } = useAuth();

    const logout = useCallback(async () => {
        try {
            await api.get('/oauth2/logout');
            dispatch({ type: 'LOGOUT' });
            localStorage.removeItem('authDetails');
            localStorage.removeItem('directoryData')
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }, [dispatch]);

    return logout;
};