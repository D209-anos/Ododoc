import React, { forwardRef } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import EditIcon from '../../../assets/images/icon/editIcon.png';
import DeleteIcon from '../../../assets/images/icon/deleteIcon.png';

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    id: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

// 오른쪽 마우스 옵션
const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(({ visible, x, y, id, onEdit, onDelete }, ref) => {
    if (!visible) return null;

    const handleEdit = () => {
        onEdit(id);
    }

    const handleDelete = () => {
        onDelete(id);
    }

    return (
        <ul ref={ref} className={Sidebar.contextMenu} style={{ position: 'fixed', top: `${y}px`, left: `${x}px`, zIndex: 1000 }}>
            <div className={Sidebar.editWrapper} onClick={handleEdit}>
                <img src={EditIcon} alt="edit-icon" className={Sidebar.editIcon}/>
                <div className={Sidebar.rightClickEdit} style={{fontFamily: 'hanbitFont'}} >수정하기</div>
            </div>
            <hr />
            <div className={Sidebar.deleteWrapper} onClick={handleDelete}>
                <img src={DeleteIcon} alt="delete-icon" className={Sidebar.deleteIcon}/>
                <div className={Sidebar.rightClickDelete} style={{fontFamily: 'hanbitFont'}}>삭제하기</div>
            </div>
        </ul>
    );
});

export default ContextMenu;