import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthDetails {
    accessToken: string;
    refreshToken?: string;
    rootId?: string;
    title?: string;
    type?: string;
}

// axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_PUBLIC_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// 로그아웃 처리 함수
const logout = (): void => {
    localStorage.removeItem("autoDetails");
    localStorage.removeItem("directoryData");
    window.location.href = '/';
};


// 요청 인터셉터: 헤더에 토큰 싣기
api.interceptors.request.use(
    // 토큰 있을 때: 헤더에 토큰 싣기
    function (config) {
        const authDetails = localStorage.getItem("authDetails");
        if (authDetails) {
            const { accessToken }: AuthDetails = JSON.parse(authDetails);
            if (accessToken) {
                config.headers["Authorization"] = `${accessToken}`;
            }
        }
        // console.log(config.headers);
        return config;
    },
    // 토큰 없을 때: 에러 띄우기
    function (error) {
        return Promise.reject(error)
    }
);

// 글로벌 에러 핸들러
axios.interceptors.response.use(
    response => response,
    error => {
        console.error("Global Axios Error Handler:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 토큰 만료 시 리프레시 토큰으로 갱신
api.interceptors.response.use(
    response => response,
    async (error) => {
        console.log("Response Interceptor error:", error)
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.log("Response Interceptor: Token expired, attempting to refresh");
            originalRequest._retry = true;

            // 쿠키에서 리프레시 토큰 가져오기
            const refreshToken = Cookies.get('refreshToken');
            console.log("Response Interceptor: refreshToken from Cookies", refreshToken);
            if (refreshToken) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_PUBLIC_BASE_URL}/oauth2/issue/access-token`, {
                        refreshToken: refreshToken,
                    });

                    console.log("Response Interceptor: refresh token response", response);

                    // 리프레시 토큰 요청 성공 시 (200)
                    if (response.status === 200) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                        console.log("Response Interceptor: new access token", accessToken);
                        console.log("Response Interceptor: new refresh token", newRefreshToken);

                        localStorage.setItem("authDetails", JSON.stringify({
                            ...JSON.parse(localStorage.getItem("authDetails") || '{}'),
                            accessToken,
                        }));
                        Cookies.set('refreshToken', newRefreshToken, { secure: true, sameSite: 'strict' });

                        api.defaults.headers.common['Authorization'] = `${accessToken}`;
                        originalRequest.headers['Authorization'] = `${accessToken}`;
                        return api(originalRequest);
                    } else {
                        console.warn("Response Interceptor: Refresh token request did not return 200", response);
                        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                        logout();
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError)
                    logout();
                }
            } else {
                console.warn("Response Interceptor: No refresh token available");
                logout();
            }
        }
        return Promise.reject(error);
    }
);

export default api;