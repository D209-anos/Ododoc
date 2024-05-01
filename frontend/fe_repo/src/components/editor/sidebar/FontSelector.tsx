import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, SelectChangeEvent } from '@mui/material';

interface FontSelectorProps {
    selectedFont: string;
    onChangeFont: (event: SelectChangeEvent<string>) => void;
}

const fontNames = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Tahoma'
]

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onChangeFont }) => {
    return (
        <FormControl sx={{ m: 1, width: 300, '.MuiOutlinedInput-notchedOutline': { borderColor: '#fd9c5f' }, marginLeft: 3 }}>
            <InputLabel id="font-selector-label">Font</InputLabel>
            <Select
                labelId="font-selector-label"
                id="font-selector"
                value={selectedFont}
                onChange={onChangeFont}
                input={<OutlinedInput label="Font" />}
            >
                {fontNames.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default FontSelector;