import api from './api'

// 인가 코드 백엔드로 전송
export const sendCodeToBackend = async(code: string, provider: string, setAccessToken: (token: string) => void) => {
    try {
        const response = await api.post(`api/oauth2/authorization/${provider}`, {
            code: code,
            url: "http://localhost:3000/oauth?provider=kakao"
        });
        console.log('Access Token:', response.data);
        
        // 엑세스 토큰 상태 관리
        setAccessToken(response.data.data.accessToken);
        // local storage에 토큰 저장
        localStorage.setItem('accessToken', response.data.data.accessToken);
    } catch (error) {
        console.error('Error sending authorization code:', error)
    }
}
