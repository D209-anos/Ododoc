import React, { useEffect, useState } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css'

interface NameEditorProps {
    objectId: number;                       // 현재 폴더 또는 파일의 ID
    name: string;                           // 수정할 폴더 또는 파일의 이름
    setName: (name: string) =>  void;       // 이름 상태 업데이트 함수
    saveName: (objectId: number, name: string) => void;     // 이름 저장 함수
    createDirectory: (objectId: number, name: string, type: string) => Promise<void>;
    type: 'FOLDER' | 'FILE';
}

const NameEditor: React.FC<NameEditorProps> = ({ 
    objectId, 
    name, 
    setName, 
    saveName,
    createDirectory,
    type
}) => {
    const [inputName, setInputName] = useState(name);

    useEffect(() => {
        setInputName(name);
    }, [name]);

    // 폴더명 및 파일명 바꾸는 함수
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value)
    };

    // 폴더명 및 파일명 수정 후 엔터 쳤을 때 실행되는 함수
    const handleBlur = async () => {
        try {
            await saveName(objectId, inputName);
            setName(inputName)
        } catch (error) {

        }
    };

    // 폴더명 및 파일명 수정 후 실행되는 함수
    const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // await createDirectory(objectId, inputName, type);
            await saveName(objectId, inputName);
            setName(inputName);
        } catch (error) {

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

export default NameEditor;