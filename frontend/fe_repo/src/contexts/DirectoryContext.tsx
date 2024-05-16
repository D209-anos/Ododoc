import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}

interface DirectoryContextType {
    directoryData: MyDirectoryItem | null;
    setDirectoryData: React.Dispatch<React.SetStateAction<MyDirectoryItem | null>>;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

interface DirectoryProviderProps {
    children: ReactNode;
}

export const DirectoryProvider: React.FC<DirectoryProviderProps> = ({ children }) => {
    const [directoryData, setDirectoryData] = useState<MyDirectoryItem | null>(null);

    return (
        <DirectoryContext.Provider value={{ directoryData, setDirectoryData }}>
            { children }
        </DirectoryContext.Provider>
    );
};

export const useDirectory = () => {
    const context = useContext(DirectoryContext);
    if (!context) {
        throw new Error('useDirectory must be used within a DirectoryProvider');
    }
    return context;
}