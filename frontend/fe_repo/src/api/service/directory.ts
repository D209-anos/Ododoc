import api from '../instances/api';

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
export const fetchDirectory = async (rootId: number | null): Promise<IContentItem | null> => {
    try {
        const response = await api.get<Response>(`/directory/${rootId}`);
        const data = response.data.data

        // localStorage.setItem('directoryData', JSON.stringify(data));
        return data;
    } catch (error: any) {
        console.error('Failed to fetch directory:', error.response?.data || error.message);
        return null;
    }
};

// directory 생성
export const createDirectory = async (parentId: number, name: string, type: string) => {
    try {
        const response = await api.post('/directory', { 
            parentId: parentId,
            name: name,
            type: type
        })
        return response.data;
    } catch (error) {
        console.error('디렉토리 생성 에러', error);
        throw error;
    }
}

// directory 삭제
export const deleteDirectoryItem = async (option: string, directoryId: number) => {
    try {
        const response = await api.delete(`/directory/${option}/${directoryId}`)
        const data = response.data.data

        return data;
    } catch (error) {
        console.error('폴더 및 파일 삭제 에러:', error);
        throw error;
    }
}

// directory 수정
export const editDirectoryItem = async (id: number, name: string) => {
    try {
        const response = await api.put('/directory/edit', {
            id: id,
            name: name
        })
        const data = response.data.data
        return data
    } catch (error) {
        console.log('디렉토리 수정 에러:', error)
        throw error;
    }
}

// 휴지통 조회
export const fetchTrashbin = async () => {
    try {
        const response = await api.get('/directory/trashbin')
        const data = response.data.data
        return data
    } catch (error) {
        console.error('휴지통 조회 에러:', error)
        throw error;
    }
}