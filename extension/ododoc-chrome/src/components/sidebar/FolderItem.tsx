import React, { useState } from 'react';
import '../../css/directory/directory.css';
import FolderImage from '../../images/icon/forder.png'


interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

interface FolderItemProps {
    item: IContentItem;
    toggleModal: (id: number) => void;
    modalActive: Record<number, boolean>;
    renderContents: (contents: IContentItem[] | undefined) => JSX.Element[];
    handleItemClick: (id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (newName: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ item, toggleModal, modalActive, renderContents, handleItemClick, selectedItem, isContentEditing, setIsContentEditing, saveName }) => {
    const [isFolderOpen, setIsFolderOpen] = useState(false);

    // 폴더 하위 요소 여닫는 함수
    const toggleFolder = () => {
        setIsFolderOpen(!isFolderOpen);
        handleItemClick(item.id)
    }


    return (
        <div key={item.id} className="forderSpace">
            <div className="folderWrapper" onClick={toggleFolder}>
                <img src={FolderImage} alt="" className="forderImage" />
                <div style={{ fontFamily: 'hanbitFont' }} className="folderName">{item.name}</div>
                
            </div>
            {isFolderOpen && item.contents && Array.isArray(item.contents) && renderContents(item.contents)}           
        </div>
    );
};

export default FolderItem