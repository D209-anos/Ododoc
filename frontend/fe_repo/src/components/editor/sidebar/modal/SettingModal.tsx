import React, { useState, useRef } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Setting from '../../../../css/components/editor/SettingModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'
import SettingImage from '../../../../assets/images/icon/settingIcon.png'
import DarkModeSwitch from '../DarkModeSwitch';
import FontSelector from '../FontSelector';
import FontSizeSlider from '../FontSizeSlider';
import { useDarkMode } from '../../../../contexts/DarkModeContext';
import useHandleClickOutside from '../../../../hooks/useHandleClickOutside';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}


const SettingModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const { isDarkMode, setDarkMode } = useDarkMode();
    const modalRef = useRef<HTMLDivElement>(null);

    // 모드 변경 함수
    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
    }

    // 나가기 버튼 클릭 시 모달창 닫는 함수
    const clickExitButton = () => {
        onClose();
    }

    useHandleClickOutside(modalRef, onClose);

    if (!isOpen) return null;

    return (
        <div className={Setting.container}>
            <div ref={modalRef} className={Setting.settingWrapper}>
                {/* 나가기 버튼 및 설정 아이콘 */}
                <div>
                    <img src={ExitButton} alt="x-button" className={Setting.exitButton} onClick={clickExitButton}/>
                </div>
                <div className={Setting.settingTitleWrapper}>
                    <img src={SettingImage} alt="setting-icon" className={Setting.settingIcon}/>
                    <p className={Setting.settingTitle} style={{ fontFamily: 'hanbitFont' }}>설정</p>
                </div>
                <hr />
                {/* 다크 모드 변환 */}
                <div className={Setting.modeWrapper}>
                    <div className={Setting.mode}>Mode</div>
                    <div>
                        <span className={Setting.darkMode}>다크 모드</span>
                        <DarkModeSwitch isDarkMode={isDarkMode} handleModeChange={handleModeChange}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingModal