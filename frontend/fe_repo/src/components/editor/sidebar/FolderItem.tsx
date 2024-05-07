import React from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FolderImage from '../../../assets/images/icon/forder.png'
import AddButton from '../../../assets/images/mark/addbutton.png'
import FileAddModal from '../sidebar/modal/FileAddModal'

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
}

const FolderItem: React.FC<FolderItemProps> = ({ item, toggleModal, modalActive, renderContents, handleContextMenu }) => {
    return (
        <div key={item.id} style={{ marginLeft: '20px' }} className={Sidebar.forderSpace} onContextMenu={(e) => handleContextMenu(e, item.id)}>
            <div className={Sidebar.folderWrapper}>
                <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
                <div>
                    <img src={AddButton} alt="add-button" className={Sidebar.addButton} onClick={() => toggleModal(item.id)} />
                    {modalActive[item.id] && (
                        <FileAddModal isOpen={modalActive[item.id]} onClose={() => toggleModal(item.id)}>
                            <h2>Modal Title</h2>
                            <p>This is modal content!</p>
                        </FileAddModal>
                    )}
                </div>
            </div>
            {item.contents && Array.isArray(item.contents) && renderContents(item.contents)}
        </div>
    );
};

export default FolderItem