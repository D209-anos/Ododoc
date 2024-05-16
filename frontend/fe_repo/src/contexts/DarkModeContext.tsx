import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DarkModeContextType {
    isDarkMode: boolean;
    setDarkMode: (isDarkMode: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setDarkMode] = useState(false);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};