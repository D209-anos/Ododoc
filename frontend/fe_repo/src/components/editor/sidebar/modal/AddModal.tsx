import React, { ReactNode, useRef, useState, useEffect, forwardRef, RefObject } from 'react';
import Modal from '../../../../css/components/editor/Modal.module.css'
import FolderImage from '../../../../assets/images/icon/forder.png'
import FileImage from '../../../../assets/images/icon/file.png'
import ColumnLine from '../../../../assets/images/mark/columnLine.png'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const AddModal = forwardRef<HTMLImageElement, ModalProps>(({ isOpen, onClose, children }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    // 내부 useRef 항상 생성
    const internalRef = useRef<HTMLImageElement>(null);
    const [selected, setSelected] = useState<string | null>(null);

    // ref가 RefObject인지 확인 후 사용
    const effectiveRef = (ref as RefObject<HTMLImageElement>) || internalRef;
    
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});

    const handleImageClick = (imageName: string) => {
        setSelected(selected === imageName ? null : imageName);
    };

    useEffect(() => {
        if (isOpen && effectiveRef.current) {
            const imgRect = effectiveRef.current.getBoundingClientRect();
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
            setModalStyle({
                position: 'absolute',
                 top: `${imgRect.top + scrollOffset}px`,
                left: `${imgRect.right + 10}px`,
            });
        }
    }, [isOpen, effectiveRef]);

    if (!isOpen) return null;

    return (
        <div className={Modal.modalWrapper} ref={modalRef}>
            <div className={Modal.modalContent} style={modalStyle} onClick={e => e.stopPropagation()}>
                <div className={Modal.addElement}>
                    <div className={`${Modal.imageWrapper} ${selected === 'folder' ? Modal.active : ''}`} onClick={() => handleImageClick('folder')}>
                        <img src={FolderImage} alt="folder-image" className={Modal.folderImage}/>
                    </div>
                    <img src={ColumnLine} alt="column-line" className={Modal.columnLine}/>
                    <div className={`${Modal.imageWrapper} ${selected === 'file' ? Modal.active : ''}`}
                         onClick={() => handleImageClick('file')}>
                        <img src={FileImage} alt="file-image" className={Modal.fileImage}/>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AddModal