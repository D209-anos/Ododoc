// src/contexts/FileContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FileContextType {
    addingFileId: number | null;
    isAddingSubFile: boolean;
    setAddingFileId: (id: number | null) => void;
    setIsAddingSubFile: (isAdding: boolean) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [addingFileId, setAddingFileId] = useState<number | null>(null);
    const [isAddingSubFile, setIsAddingSubFile] = useState<boolean>(false);

    return (
        <FileContext.Provider value={{ addingFileId, isAddingSubFile, setAddingFileId, setIsAddingSubFile }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = (): FileContextType => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};
