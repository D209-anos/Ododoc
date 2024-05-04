import React, { forwardRef } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import EditIcon from '../../../assets/images/icon/editIcon.png';
import DeleteIcon from '../../../assets/images/icon/deleteIcon.png';

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
}

// 오른쪽 마우스 옵션
const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(({ visible, x, y }, ref) => {
    if (!visible) return null;

    return (
        <ul ref={ref} className={Sidebar.contextMenu} style={{ position: 'fixed', top: `${y}px`, left: `${x}px`, zIndex: 1000 }}>
            <div className={Sidebar.editWrapper}>
                <img src={EditIcon} alt="edit-icon" className={Sidebar.editIcon}/>
                <div className={Sidebar.rightClickEdit} style={{fontFamily: 'hanbitFont'}} >수정하기</div>
            </div>
            <hr />
            <div className={Sidebar.deleteWrapper}>
                <img src={DeleteIcon} alt="delete-icon" className={Sidebar.deleteIcon}/>
                <div onClick={() => console.log('삭제')} className={Sidebar.rightClickDelete} style={{fontFamily: 'hanbitFont'}}>삭제하기</div>
            </div>
        </ul>
    );
});

export default ContextMenu;