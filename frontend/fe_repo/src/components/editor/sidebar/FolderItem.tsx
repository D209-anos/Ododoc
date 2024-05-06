import React, { useState } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FolderImage from '../../../assets/images/icon/forder.png'
import AddButton from '../../../assets/images/mark/addbutton.png'
import FileAddModal from '../sidebar/modal/FileAddModal'
import NameEditor from './NameEditor';

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
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
    handleItemClick: (id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (newName: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ item, toggleModal, modalActive, renderContents, handleContextMenu, handleItemClick, selectedItem, isContentEditing, setIsContentEditing, saveName }) => {
    const [isFolderOpen, setIsFolderOpen] = useState(false);

    const toggleFolder = () => {
        setIsFolderOpen(!isFolderOpen);
        handleItemClick(item.id)
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
        <div key={item.id} className={Sidebar.forderSpace} onContextMenu={(e) => handleContextMenu(e, item.id)}>
            <div className={Sidebar.folderWrapper} onClick={toggleFolder}>
                <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                {
                    isContentEditing && selectedItem && selectedItem.id === item.id ?
                    renderContentNameField() : 
                    <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
                }
                <div>
                    <img src={AddButton} alt="add-button" className={Sidebar.addButton} onClick={(e) => {
                        e.stopPropagation();
                        toggleModal(item.id);
                    }} />
                    {modalActive[item.id] && (
                        <FileAddModal isOpen={modalActive[item.id]} onClose={() => toggleModal(item.id)}>
                            <h2>Modal Title</h2>
                            <p>This is modal content!</p>
                        </FileAddModal>
                    )}
                </div>
            </div>
            {isFolderOpen && item.contents && Array.isArray(item.contents) && renderContents(item.contents)}
            
        </div>
    );
};

export default FolderItem