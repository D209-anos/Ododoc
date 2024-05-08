import api from '../instances/api';

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    children?: IContentItem[] | string;
}

// directory 조회
export const fetchDirectory = async (rootId: number | null): Promise<IContentItem | null> => {
    try {
        const response = await api.get<IContentItem>(`/directory/${rootId}`);
        const data = response.data

        localStorage.setItem('directoryData', JSON.stringify(data));
        return data;
    } catch (error: any) {
        console.error('Failed to fetch directory:', error.response?.data || error.message);
        return null;
    }
};