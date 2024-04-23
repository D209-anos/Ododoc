import React, { ReactNode, useRef, useState, useEffect, forwardRef, RefObject } from 'react';
import Modal from '../../css/components/editor/Modal.module.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const AddModal = forwardRef<HTMLImageElement, ModalProps>(({ isOpen, onClose, children }, ref) => {
    // 내부 useRef 항상 생성
    const internalRef = useRef<HTMLImageElement>(null);

    // ref가 RefObject인지 확인 후 사용
    const effectiveRef = (ref as RefObject<HTMLImageElement>) || internalRef;
    
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (isOpen && effectiveRef.current) {
            const imgRect = effectiveRef.current.getBoundingClientRect();
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
            setModalStyle({
                position: 'absolute',
                 top: `${imgRect.top + scrollOffset}px`,
                left: `${imgRect.right + 10}px` // 이미지 오른쪽으로 10px 이동
            });
        }
    }, [isOpen, effectiveRef]);

    if (!isOpen) return null;

    return (
        
        <div className={Modal.modalContent} style={modalStyle} onClick={e => e.stopPropagation()}>
            hi
        </div>
    );
});

export default AddModal