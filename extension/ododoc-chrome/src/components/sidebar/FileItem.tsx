import React, { useState } from 'react';
import '../../css/directory/directory.css';
import FileImage from '../../images/icon/file.png';

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

interface FileItemProps {
    item: IContentItem;
    selected: boolean;
    handleItemClick: (id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ 
    item, 
    selected, 
    handleItemClick, 
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

    return (
        <div
            style={{ 
                backgroundColor: getBackgroundColor(), 
                color: color(), 
                borderRadius: '8px'
            }}
            className="fileSpace"
            onClick={() => handleItemClick(item.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={FileImage} alt="file-icon" className="fileImage" />
            <div style={{ fontFamily: 'hanbitFont' }} className="folderName">{item.name}</div>
        </div>
    );
};

export default FileItem;