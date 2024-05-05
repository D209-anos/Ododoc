import { Route, Routes } from 'react-router-dom';
import SideBar from '../../src/components/editor/sidebar/SideBar';
import EditorStyle from '../css/view/editor/Editor.module.css';
import Mypage from '../components/editor/mypage/Mypage';
import Editor1 from '../components/editor/editor/Editor1';

function Editor() {
    return (
        <div className={EditorStyle.editorContainer}>
            <SideBar />
            <div className={EditorStyle.editorWrapper}>
            <Routes>
                <Route index element={<Mypage/>} />
                <Route path=":id" element={<Editor1 />} />
                <Route path='profile' element={<Mypage />} />
            </Routes>
            </div>
        </div>
    )
}

export default Editor;