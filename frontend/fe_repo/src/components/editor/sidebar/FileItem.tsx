import React, { useState } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FileImage from '../../../assets/images/icon/file.png';

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
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, selected, handleItemClick, handleContextMenu }) => {
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
            className={Sidebar.fileSpace}
            onClick={() => handleItemClick(item.id)}
            onContextMenu={(e) => handleContextMenu(e, item.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={FileImage} alt="file-icon" className={Sidebar.fileImage} />
            <div className={Sidebar.fileName}>{item.name}</div>
        </div>
    );
};

export default FileItem;