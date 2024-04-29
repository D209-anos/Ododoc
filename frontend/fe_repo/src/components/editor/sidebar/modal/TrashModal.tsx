import React, { useRef } from 'react';
import Trash from '../../../../css/components/editor/TrashModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'
import useHandleClickOutside from '../../../../hooks/useHandleClickOutside';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const TrashModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useHandleClickOutside(modalRef, onClose);

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