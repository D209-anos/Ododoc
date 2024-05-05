import api from '../instances/api'

// 인가 코드 백엔드로 전송
export const sendCodeToBackend = async(code: string, url: string, provider: string, setAccessToken: (token: string) => void) => {
    try {
        console.log("code: ", code);
        console.log("url: ", url);
        console.log("provider: ", provider);
        
        const response = await api.post(`/oauth2/authorization/${provider}`, {
            code: code,
            url: url
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

// 로그아웃
// export const logout = async() => {
//     try {
//         const accessToken = localStorage.getItem('accessToken');
//         if (!accessToken) {
//             throw new Error('엑세스 토큰을 찾을 수 없네욤..');
//         }

//         const response = await api.post('/oauth2/logout', {}, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });
//         console.log('성공적으로 로그인 되었음!', response.data);

//         // 로그아웃 후 local storage 토큰 제거
//         localStorage.removeItem('accessToken');
//     } catch (error) {
//         console.error('로그아웃 도중 문제 발생!!!', error);
//     }
// }