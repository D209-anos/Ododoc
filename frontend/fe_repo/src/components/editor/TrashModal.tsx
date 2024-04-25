import React, { useState, useRef, useEffect } from 'react';
import Trash from '../../css/components/editor/TrashModal.module.css'
import ExitButton from '../../assets/images/xbutton.png'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const TrashModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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

    const clickExitButton = () => {
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className={Trash.container}>
            <div className={Trash.trashWrapper} ref={modalRef}>
                <img src={ExitButton} alt="x-button" className={Trash.exitButton} onClick={clickExitButton}/>
                TrashBox
            </div>
        </div>
    )
}

export default TrashModal