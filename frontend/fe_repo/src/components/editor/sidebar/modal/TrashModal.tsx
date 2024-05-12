import React, { useRef, useState, useEffect } from 'react';
import Trash from '../../../../css/components/editor/TrashModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'
import useHandleClickOutside from '../../../../hooks/useHandleClickOutside';
import TrashIcon from '../../../../assets/images/icon/trashIcon.png'
import FileImage from '../../../../assets/images/icon/file.png'
import FolderImage from '../../../../assets/images/icon/forder.png'
import Swal from 'sweetalert2';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchTrashbin } from '../../../../api/service/directory';
import Restore from '../../../../assets/images/icon/restore.png';
import ForeverDelete from '../../../../assets/images/icon/foreverDelete.png';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    trashbinTime: string;
    contents?: string | IContentItem[];
}

const TrashModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useAuth();
    const { accessToken } = state;
    const [trashbinData, setTrashbinData] = useState<IContentItem[]>([]);
    useHandleClickOutside(modalRef, onClose);

    const clickExitButton = () => {
        onClose();
    }

    const handleItemClick = (item: IContentItem) => {
        handleRestore(item);
    }

    //휴지통 조회
    useEffect(() => {
        const loadTrashbin = async () => {
            if (accessToken) {
                try {
                    console.log("휴지통에 데이터 잘 들어옴")
                    console.log(trashbinData)
                    const data = await fetchTrashbin();
                    setTrashbinData(data);
                } catch (error) {
                    console.error('휴지통 조회 에러:', error)
                }
            } 
        };
        loadTrashbin();
    }, [])

    // 휴지통 복원 모달
    const handleRestore = (item: IContentItem) => {
        Swal.fire({
            html: '<h2 style="font-family: hanbitFont, sans-serif;">복원하시겠습니까??</h2>',
            icon: 'warning',
            showCancelButton: true
        }).then((result) => {
            onClose();
            if (result.isConfirmed) {
                //  이 안에 복원시킬 때 사용할 api 들어가야 함
                Swal.fire({
                    html: '<h2 style="font-family: hanbitFont, sans-serif;">복원되었습니다.</h2>',
                    icon: 'success'
                })
            }
        })
    }

    if (!isOpen) return null;

    // 삭제된 폴더 및 파일 리스트
    const renderTopLevelContent = (data: IContentItem[]) => {
        return data.map((content) => (
            <div className={Trash.fileItem} key={content.id} >
                <div className={Trash.nameWrapper}>
                    <img 
                        src={content.type === 'FILE' ? FileImage : FolderImage} 
                        alt={content.type === 'FILE' ? "file-image" : "folder-image"} 
                        className={Trash.contentImage}
                    />
                    <p className={Trash.contentName}>{content.name}</p>
                </div>
                <p>{content.trashbinTime}</p>
                <p>{content.type}</p>
                <p className={Trash.DeleteWrapper}>
                    <div className={Trash.RestoreWrapper}>
                        <img src={Restore} alt="restore-image" className={Trash.Restore} onClick={() => handleItemClick(content)}/>
                    </div>
                    <div>
                        <img src={ForeverDelete} alt="forever-Delete-image" className={Trash.ForeverDelete} />
                    </div>
                </p>
            </div>
        ));
    };

    return (
        // 휴지통
        <div className={Trash.container}>
            <div className={Trash.trashWrapper} ref={modalRef}>
                <div>
                    <img src={ExitButton} alt="x-button" className={Trash.exitButton} onClick={clickExitButton}/>
                </div>
                <div className={Trash.trashTitleWrapper}>
                    <img src={TrashIcon} alt="trash-icon" className={Trash.trashIcon}/>
                    <p className={Trash.trashTitle} style={{ fontFamily: 'hanbitFont' }}>휴지통</p>
                </div>
                <hr />
                <div className={Trash.deleteFileWrapper}>
                    <div className={Trash.deleteFileTitle}>
                        <p className={Trash.fileName}>파일명</p>
                        <p>삭제된 날짜</p>
                        <p>항목 유형</p>
                        <p>복원/삭제</p>
                    </div>
                    {/* 휴지통에 버린 폴더 및 파일 리스트 */}
                    {trashbinData && renderTopLevelContent(trashbinData)}
                    {children}
                </div>
            </div>
        </div>
    )
}



export default TrashModal