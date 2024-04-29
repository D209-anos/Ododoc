import React, { useRef } from 'react';
import Setting from '../../../../css/components/editor/SettingModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'
import useHandleClickOutside from '../../../../hooks/useHandleClickOutside';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const SettingModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useHandleClickOutside(modalRef, onClose);

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