import api from './api';

interface Response {
    status: number,
    data: any
}
interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    children?: IContentItem[] | string;
}

// directory 조회
export const fetchDirectory = async (rootId: number | null, token: string | null): Promise<IContentItem | null> => {
    try {
        const response = await api.get<Response>(`/directory/${rootId}`, {
            headers: {
              Authorization: token,
            },
          });
        const data = response.data.data

        // localStorage.setItem('directoryData', JSON.stringify(data));
        return data;
    } catch (error: any) {
        console.error('Failed to fetch directory:', error.response?.data || error.message);
        return null;
    }
};