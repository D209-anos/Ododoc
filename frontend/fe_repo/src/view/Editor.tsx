import Editor1 from '../components/editor/Editor1';
import { Route, Link, Routes } from 'react-router-dom';
import SideBar from '../../src/components/editor/SideBar';
import EditorStyle from '../css/view/Editor.module.css';
import Mypage from '../components/editor/Mypage';

function Editor() {
    return (
        <div className={EditorStyle.editorContainer}>
            <SideBar />
            <div className={EditorStyle.editorWrapper}>
            <Routes>
                <Route path="/mypage" element={<Mypage/>} />
                <Route path="/" element={<Editor1 />} />
            </Routes>
            </div>
        </div>

    )
}

export default Editor;