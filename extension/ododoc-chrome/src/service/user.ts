import api from './api'
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

            const { accessToken, rootId, title, type } = response.data.data;
            // 상태 업데이트
            dispatch({ type: 'SET_AUTH_DETAILS', payload: { accessToken, rootId, title, type } });
            localStorage.setItem('authDetails', JSON.stringify({ accessToken, rootId, title, type }))
        } catch (error) {
            console.error('Error sending authorization code:', error);
        }
    }, [dispatch]);

    return sendCodeToBackend;
};

// 로그아웃
export const logout = async() => {
    try {
        const accessToken = chrome.storage.local.get('accessToken');
        console.log(accessToken)
        if (!accessToken) {
            throw new Error('엑세스 토큰을 찾을 수 없네욤..');
        }

        const response = await api.get('/oauth2/logout', {});
        console.log('성공적으로 로그아웃 되었음!', response.data);

        // 로그아웃 후 local storage 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('provider');
        localStorage.removeItem('rootId');
        localStorage.removeItem('title');
        chrome.storage.local.clear(() => {
            console.log('Chrome storage cleared');
        });
    } catch (error) {
        console.error('로그아웃 도중 문제 발생!!!', error);
    }
}