import React from 'react';
import Slider from '@mui/material/Slider';

interface FontSizeSliderProps {
    fontSize: number;
    handleFontSizeChange: (event: Event, newValue: number | number[]) => void;
    marks: { value: number; label: string }[];
}

const FontSizeSlider: React.FC<FontSizeSliderProps> = ({ fontSize, handleFontSizeChange, marks }) => {
    return (
        <Slider
            aria-label="Font Size"
            value={fontSize}
            onChange={handleFontSizeChange}
            valueLabelDisplay="auto"
            step={1}
            marks={marks}
            sx={{ width: 300, color: '#fd9c5f', marginLeft: 3 }}
        />
    );
};

export default FontSizeSlider;