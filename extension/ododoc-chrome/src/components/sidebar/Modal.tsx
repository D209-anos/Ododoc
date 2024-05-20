import React from 'react';
import '../../css/directory/modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, name }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ fontFamily: 'hanbitFont, sans-serif' }}>
                <h2>선택된 파일명</h2>
                <p>{name}</p>
                <button onClick={onClose} style={{ fontFamily: 'hanbitFont, sans-serif' }}>닫기</button>
            </div>
        </div>
    );
};

export default Modal;