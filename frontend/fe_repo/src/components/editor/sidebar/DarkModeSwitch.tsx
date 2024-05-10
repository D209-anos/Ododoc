import React from 'react';
import Switch from '@mui/material/Switch';

interface DarkModeSwitchProps {
    isDarkMode: boolean;
    handleModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({ isDarkMode, handleModeChange }) => {
    return (
        <Switch 
            checked={isDarkMode}
            onChange={handleModeChange}
            color="warning"
        />
    );
};

export default DarkModeSwitch;