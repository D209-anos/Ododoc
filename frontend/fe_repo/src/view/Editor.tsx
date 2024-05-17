import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import SideBar from '../../src/components/editor/sidebar/SideBar';
import EditorStyle from '../css/view/editor/Editor.module.css';
import Mypage from '../components/editor/mypage/Mypage';
import Editor1 from '../components/editor/editor/Editor1';
import { useDarkMode } from '../contexts/DarkModeContext'


function Editor() {
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const { isDarkMode, setDarkMode } = useDarkMode();


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();  // 기본 이벤트 방지
        document.addEventListener('mousemove', handleMouseMove as any);
        document.addEventListener('mouseup', handleMouseUp as any);
    }

    const handleMouseMove = (e: MouseEvent): void => {
        const newWidth = Math.max(150, Math.min(2500, e.clientX));
        setSidebarWidth(newWidth);
    }

    const handleMouseUp = (): void => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp as any);
    }

    return (
        <div className={`${EditorStyle.editorContainer} ${isDarkMode ? 'darkMode' : ''}`}>
            <div 
                className={EditorStyle.sidebarWrapper}
                style={{ width: `${sidebarWidth}px` }}
            >
                <SideBar />
                <div
                    className={EditorStyle.handle}
                    onMouseDown={handleMouseDown}
                ></div>
            </div>
            <div className={`${EditorStyle.editorWrapper} ${isDarkMode ? 'darkMode' : ''}`}>
                <Routes>
                    {/* <Route index element={<Mypage/>}/> */}
                    <Route path=":id" element={<Editor1 />} />
                    <Route path="profile" element={<Mypage/>} />
                </Routes>
            </div>
        </div>
    )
}

export default Editor;
