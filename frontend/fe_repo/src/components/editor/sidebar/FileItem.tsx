import React, { useState, useEffect } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FileImage from '../../../assets/images/icon/file.png';
import NameEditor from './NameEditor';
import { createDirectory } from '../../../api/service/directory';
import { useFileContext } from '../../../contexts/FileContext';

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

interface FileItemProps {
    item: IContentItem;
    parentId: number | null;
    selected: boolean;
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
    handleItemClick: (id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (objectId: number, name: string) => void;
    setCreateFileParentId: (id: number | null) => void;
    addingFileId: number | null;
    setAddingFileId: (id: number | null) => void;
    isAddingSubFile: boolean;
    setIsAddingSubFile: (isAdding: boolean) => void;
    saveNewFile: (objectId: number, newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ 
    item,
    parentId,
    selected,
    handleContextMenu, 
    handleItemClick,
    selectedItem,
    isContentEditing,
    saveName,
    saveNewFile,
}) => {
    const [isHovered, setIsHovered] = useState(false);      // 파일 배경색 
    const [newFileName, setNewFileName] = useState('');
    const { addingFileId, isAddingSubFile, setAddingFileId, setIsAddingSubFile } = useFileContext();
    
    useEffect(() => {
        console.log("addingFileId:", addingFileId);
        console.log("isAddingSubFile:", isAddingSubFile);
    }, [addingFileId, isAddingSubFile]);

    // 파일 배경색
    const getBackgroundColor = () => {
        if (selected) return '#ff914d';
        if (isHovered) return 'gray';
        return 'transparent'
    }

    // 파일 글자 색상
    const color = () => {
        if (selected) return 'white';
        if (isHovered) return 'white';
        return 'black'
    }

    // 파일명 수정 함수
    const renderContentNameField = (): JSX.Element | null => {
        if (isContentEditing && selectedItem && selectedItem.id === item.id) {

            return (
                <div>
                    <NameEditor 
                        objectId={selectedItem.id}
                        name={selectedItem.name}
                        setName={(newName) => {
                            selectedItem.name = newName;
                        }}
                        saveName={saveName}
                        createDirectory={createDirectory}
                        type='FILE'
                    />
                </div>
            )
        }
        return null;
    }

    return (
        <div
            style={{ 
                backgroundColor: getBackgroundColor(), 
                color: color(), 
                borderRadius: '8px'
            }}
            className={Sidebar.fileSpace}
            onClick={() => handleItemClick(item.id)}
            onContextMenu={(e) => handleContextMenu(e, item.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={FileImage} alt="file-icon" className={Sidebar.fileImage} />
            {isContentEditing && selectedItem && selectedItem.id === item.id ? (
                renderContentNameField()
            ) : (
                <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>
                    {item.name}
                </div>
            )}
            {addingFileId === item.id && isAddingSubFile && (
                <div>
                    <NameEditor 
                        objectId={item.id}
                        name=''
                        setName={setNewFileName}
                        saveName={(objectId, name) => {
                            saveNewFile(objectId, name);
                            setAddingFileId(null);
                            setIsAddingSubFile(false);
                        }}
                        createDirectory={createDirectory}
                        type='FILE'
                    />
                </div>
            )}
        </div>
    );
};

export default FileItem;