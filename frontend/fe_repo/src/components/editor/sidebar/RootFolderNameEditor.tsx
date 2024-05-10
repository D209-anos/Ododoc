import React, { useState, useEffect } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import { createDirectory } from '../../../api/service/directory';


interface RootFolderNameEditorProps {
    objectId: number;                       // 현재 폴더 또는 파일의 ID
    name: string;                           // 수정할 폴더 또는 파일의 이름
    setName: React.Dispatch<React.SetStateAction<string>>;
    saveNewFolder: () => void; // 새로운 프로퍼티 추가
}

const RootFolderNameEditor: React.FC<RootFolderNameEditorProps> = ({ 
    objectId, 
    name, 
    setName, 
    saveNewFolder,
}) => {
    const [inputName, setInputName] = useState(name);

    useEffect(() => {
        setName(inputName);
    }, [inputName, setName])

    // 파일 또는 폴더명 바꾸는 함수
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value)
    };

    // 파일 또는 폴더명 작성 후 엔터 쳤을 때 실행되는 함수
    const handleBlur = async() => {
        setName(inputName);
        saveNewFolder();
    }

    const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("들어오긴 하니?")
        console.log(objectId)
        console.log(inputName)
        try {
            const response = await createDirectory(objectId, inputName, 'FOLDER');
            console.log('폴더 생성 response:', response);
            setName(inputName);
            saveNewFolder();
        } catch (error) {
            console.log('폴더 생성 에러:', error);
        }

        
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
                style={{ fontFamily: 'hanbitFont' }}
                maxLength={30}
            />
        </form>
    )
}

export default RootFolderNameEditor;