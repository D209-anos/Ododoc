import api from '../instances/api';

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: IContentItem[] | string;
}

// directory 조회
export const fetchDirectory = async (rootId: number): Promise<IContentItem | null> => {
    try {
        const response = await api.get<IContentItem>(`/directory/${rootId}`);
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch directory:', error.response?.data || error.message);
        return null;
    }
};