// components/ContentItem.tsx
import React from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FolderImage from '../../../assets/images/icon/forder.png';
import FileImage from '../../../assets/images/icon/file.png';
import FileAddModal from '../sidebar/modal/FileAddModal';

// interface ContentItemProps {
//     item: IContentItem;
//     modalActive: Record<number, boolean>;
//     toggleModal: (id: number) => void;
//     handleRightClick: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
// }

// const ContentItem: React.FC<ContentItemProps> = ({ item, modalActive, toggleModal, handleRightClick }) => {
//     if (item.type === 'FOLDER') {
//         return (
//             <div style={{ marginLeft: '20px' }} className={Sidebar.forderSpace} onContextMenu={(e) => handleRightClick(e, item.id)}>
//                 <div className={Sidebar.folderWrapper}>
//                     <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
//                     <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
//                     <div>
//                         <img src={AddButton} alt="add-button" className={Sidebar.addButton} onClick={() => toggleModal(item.id)} />
//                         {modalActive[item.id] && (
//                             <FileAddModal isOpen={modalActive[item.id]} onClose={() => toggleModal(item.id)}>
//                                 <h2>Modal Title</h2>
//                                 <p>This is modal content!</p>
//                             </FileAddModal>
//                         )}
//                     </div>
//                 </div>
//                 {item.contents && Array.isArray(item.contents) && renderContents(item.contents)}
//             </div>
//         );
//     } else {
//         return (
//             <div style={{ marginLeft: '20px' }} className={Sidebar.fileSpace} onContextMenu={(e) => handleRightClick(e, item.id)}>
//                 <img src={FileImage} alt="file-image" className={Sidebar.fileImage} />
//                 <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.fileName}>{item.name}</div>
//             </div>
//         );
//     }
// };

function ContentItem () {
    return (
        <div>

        </div>
    )
}

export default ContentItem;