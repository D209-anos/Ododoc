import React from 'react';
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
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, handleContextMenu }) => {
    return (
        <div key={item.name} style={{ marginLeft: '20px' }} className={Sidebar.fileSpace} onContextMenu={(e) => handleContextMenu(e, item.id)}>
            <img src={FileImage} alt="file-image" className={Sidebar.fileImage} />
            <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.fileName}>{item.name}</div>
        </div>
    );
};

export default FileItem;