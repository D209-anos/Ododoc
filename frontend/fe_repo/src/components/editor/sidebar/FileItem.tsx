import React, { useState } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FileImage from '../../../assets/images/icon/file.png';
import NameEditor from './NameEditor';

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
    handleItemClick: (id: number) => void;
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ 
    item,
    parentId,
    selected, 
    handleItemClick, 
    handleContextMenu, 
    selectedItem,
    isContentEditing,
    setIsContentEditing,
    saveName
}) => {
    const [isHovered, setIsHovered] = useState(false);

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
                    saveName={() => setIsContentEditing(false)}
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
            {
                isContentEditing && selectedItem && selectedItem.id === item.id ?
                renderContentNameField() : 
                <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
            }
        </div>
    );
};

export default FileItem;