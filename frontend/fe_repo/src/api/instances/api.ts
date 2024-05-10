import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_PUBLIC_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// 요청 인터셉터: 헤더에 토큰 싣기
api.interceptors.request.use(
    // 토큰 있을 때: 헤더에 토큰 싣기
    function (config) {
        const authDetails = localStorage.getItem("authDetails");
        if (authDetails) {
            const { accessToken } = JSON.parse(authDetails);
            if (accessToken) {
                config.headers["Authorization"] = `${accessToken}`;
            }

        }
        return config;
    },
    // 토큰 없을 때: 에러 띄우기
    function (error) {
        return Promise.reject(error)
    }
);

export default api;