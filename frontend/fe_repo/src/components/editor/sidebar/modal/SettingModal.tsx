import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Setting from '../../../../css/components/editor/SettingModal.module.css'
import ExitButton from '../../../../assets/images/mark/xbutton.png'
import SettingImage from '../../../../assets/images/icon/settingIcon.png'
import DarkModeSwitch from '../DarkModeSwitch';
import FontSelector from '../FontSelector';
import FontSizeSlider from '../FontSizeSlider';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

// 폰트 크기
const marks = [
    { value: 0, label: '0' }, { value: 10, label: '10' }, { value: 20, label: '20' }, { value: 30, label: '30' }, { value: 40, label: '40' },
    { value: 50, label: '50' }, { value: 60, label: '60' }, { value: 70, label: '70' }, { value: 80, label: '80' }, { value: 90, label: '90' }, { value: 100, label: '100' },
];

const SettingModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [isDarkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(20);
    const [selectedFont, setSelectedFont] = useState('');

    // 모드 변경 함수
    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
    }

    // 폰트 크기 변경 함수
    const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
        setFontSize(newValue as number);
    }

    // 글꼴 변경 함수
    const handleChangeFont = (event: SelectChangeEvent<string>) => {
        setSelectedFont(event.target.value as string);
    };

    // 나가기 버튼 클릭 시 모달창 닫는 함수
    const clickExitButton = () => {
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className={Setting.container}>
            <div className={Setting.settingWrapper}>
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
                <div className={Setting.mode}>Mode</div>
                <div>
                    <span className={Setting.darkMode}>다크 모드</span>
                    <DarkModeSwitch isDarkMode={isDarkMode} handleModeChange={handleModeChange}/>
                </div>
                {/* 폰트 설정 */}
                <div className={Setting.mode}>Font</div>
                <FontSelector selectedFont={selectedFont} onChangeFont={handleChangeFont}/>
                {/* 폰트 크기 설정 */}
                <div className={Setting.mode}>Font Size</div>
                <FontSizeSlider fontSize={fontSize} handleFontSizeChange={handleFontSizeChange} marks={marks}/>
            </div>
        </div>
    );
};

export default SettingModal