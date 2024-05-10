import React, { useState, useEffect } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import { createDirectory } from '../../../api/service/directory';

interface FolderNameEditorProps {
    objectId: number;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    saveNewFolder: () => void;
}

const FolderNameEditor: React.FC<FolderNameEditorProps> = ({
    objectId,
    name,
    setName,
    saveNewFolder
}) => {
    const [inputName, setInputName] = useState(name);

    useEffect(() => {
        setName(inputName);
    }, [inputName, setName])

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value);
    };

    const handleBlur = async () => {
        setName(inputName);
        saveNewFolder();
    };

    const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName(inputName);
        saveNewFolder();
    };

    return (
        <form onSubmit={handleNameSubmit} className={Sidebar.renderNameField}>
            <input 
                type="text"
                value={inputName}
                onChange={handleNameChange}
                onBlur={handleBlur}
                autoFocus
                className={Sidebar.renderNameField}
                style={{fontFamily: 'hanbitFont'}}
                maxLength={30}
            />
        </form>
    ) 
}

export default FolderNameEditor;