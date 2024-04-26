import React, { useState, useRef, useEffect } from 'react';
import Setting from '../../../../css/components/editor/SettingModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const SettingModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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
        <div className={Setting.container}>
            <div className={Setting.settingWrapper} ref={modalRef}>
                <img src={ExitButton} alt="x-button" className={Setting.exitButton} onClick={clickExitButton}/>
                Setting
            </div>
        </div>
    )
}

export default SettingModal