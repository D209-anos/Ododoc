import api from '../instances/api'

interface Response {
    status: number,
    data: any
}

// 디렉토리 조회 API 함수
export const fetchProfile = async (): Promise<any> => {
    try {
        const response = await api.get<Response>(`/directory`, {
        });
        const data = response.data.data;
        return data;
    } catch (error: any) {
        return null;
    }
};
