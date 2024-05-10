import React, { useState } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css'

interface NameEditorProps {
    objectId: number;                       // 현재 폴더 또는 파일의 ID
    name: string;                           // 수정할 폴더 또는 파일의 이름
    setName: (name: string) =>  void;       // 이름 상태 업데이트 함수
    saveName: (objectId: number, name: string) => void;     // 이름 저장 함수
}

const NameEditor: React.FC<NameEditorProps> = ({ 
    objectId, 
    name, 
    setName, 
    saveName,
}) => {
    const [inputName, setInputName] = useState(name);

    // 파일 또는 폴더명 바꾸는 함수
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value)
    };

    // 파일 또는 폴더명 수정 후 엔터 쳤을 때 실행되는 함수
    const handleBlur = () => {
        saveName(objectId, inputName);
        setName(inputName);
    }

    const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveName(objectId, inputName);
        setName(inputName);
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

export default NameEditor;