import React, { createContext, useContext, useState } from 'react';

interface FileContextType {
    addingFileId: number | null;
    isAddingSubFile: boolean;
    setAddingFileId: (id: number | null) => void;
    setIsAddingSubFile: (isAdding: boolean) => void;
}

// 초기 상태
const initialFileContext: FileContextType = {
    addingFileId: null,
    isAddingSubFile: false,
    setAddingFileId: () => {},
    setIsAddingSubFile: () => {}
};

const FileContext = createContext<FileContextType>(initialFileContext);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addingFileId, setAddingFileId] = useState<number | null>(null);
    const [isAddingSubFile, setIsAddingSubFile] = useState<boolean>(false);

    return (
        <FileContext.Provider value={{ addingFileId, isAddingSubFile, setAddingFileId, setIsAddingSubFile}}>
            {children}
        </FileContext.Provider>
    )
}

export const useFileContext = () => useContext(FileContext);