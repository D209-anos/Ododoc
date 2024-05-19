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
        throw error;
    }
}

// directory 이동
export const moveDirectoryItem = async (id: number, parentId: number) => {
    try {
        const response = await api.put('/directory/move', {
            id: id,
            parentId: parentId
        });
        const data = response.data.data;
        return data;
    } catch (error) {
        throw error;
    }
};

// 휴지통 조회
export const fetchTrashbin = async () => {
    try {
        const response = await api.get('/directory/trashbin')
        const data = response.data.data
        return data
    } catch (error) {
        throw error;
    }
}

// 휴지통 복원
export const restoreDirectoryItem = async (directoryId: number): Promise<IContentItem | null> => {
    try {
        const response = await api.put<Response>(`/directory/restore/${directoryId}`);
        const data = response.data.data;

        return data;
    } catch (error: any) {
        throw error;
    }
}