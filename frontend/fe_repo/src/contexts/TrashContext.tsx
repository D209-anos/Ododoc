import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTrashbin } from '../api/service/directory';
import { useAuth } from './AuthContext';

interface TrashContextProps {
    trashbinData: IContentItem[];
    loadTrashbin: () => void;
}

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    trashbinTime: string;
    contents?: string | IContentItem[];
}

const TrashContext = createContext<TrashContextProps | undefined>(undefined);

export const useTrash = () => {
    const context = useContext(TrashContext);
    if (!context) {
        throw new Error('useTrash must be used within a TrashProvider');
    }
    return context;
};

export const TrashProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state } = useAuth();
    const { accessToken } = state;
    const [trashbinData, setTrashbinData] = useState<IContentItem[]>([]);

    const loadTrashbin = async () => {
        if (accessToken) {
            try {
                const data = await fetchTrashbin();
                setTrashbinData(data);
            } catch (error) {
                console.error('휴지통 조회 에러:', error);
            }
        }
    };

    useEffect(() => {
        loadTrashbin();
    }, [accessToken]);

    return (
        <TrashContext.Provider value={{ trashbinData, loadTrashbin }}>
            {children}
        </TrashContext.Provider>
    );
};