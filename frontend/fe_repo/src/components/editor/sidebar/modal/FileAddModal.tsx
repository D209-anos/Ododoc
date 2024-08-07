import React, { ReactNode, useRef, useState, useEffect, forwardRef, RefObject } from 'react';
import Modal from '../../../../css/components/editor/Modal.module.css'
import FolderImage from '../../../../assets/images/icon/forder.png'
import FileImage from '../../../../assets/images/icon/file.png'
import useHandleClickOutside from '../../../../hooks/useHandleClickOutside';
import useModalStyle from '../../../../hooks/useSetModal'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    onAddFolder: () => void;
    onAddFile: () => void;
}

const FileAddModal = forwardRef<HTMLImageElement, ModalProps>(
    ({ isOpen, onClose, children, onAddFolder, onAddFile }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);          // 모달 외부 클릭 감지
    useHandleClickOutside(modalRef, onClose);

    // 이미지 선택 및 모달 스타일
    const internalRef = useRef<HTMLImageElement>(null);
    const effectiveRef = (ref as RefObject<HTMLImageElement>) || internalRef;
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
    useModalStyle(isOpen, effectiveRef, setModalStyle);

    if (!isOpen) return null;

    return (
        <div className={Modal.modalWrapper} ref={modalRef}>
            <div className={Modal.modalContent} style={modalStyle} onClick={e => e.stopPropagation()}>
                <div className={Modal.addElement}>
                    <div 
                        className={Modal.imageWrapper}  onClick={() => {
                            onAddFolder();
                            onClose();
                        }}>
                        <img src={FolderImage} alt="folder-image" className={Modal.folderImage}/>
                        <div className={Modal.title}>폴더 추가</div>
                    </div>
                    <div className={Modal.imageWrapper} onClick={() => {
                        onAddFile();
                        onClose();
                    }}>
                        <img src={FileImage} alt="file-image" className={Modal.fileImage}/>
                        <div className={Modal.title}>파일 추가</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FileAddModal