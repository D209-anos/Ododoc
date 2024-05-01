<<<<<<< HEAD
import Editor1 from '../components/editor/Editor1';
import { Route, Link, Routes } from 'react-router-dom';
import SideBar from '../../src/components/editor/SideBar';
import EditorStyle from '../css/view/Editor.module.css';
import Mypage from '../components/editor/Mypage';
=======
import Editor1 from '../components/editor/editor/Editor1';
import SideBar from '../components/editor/sidebar/SideBar';
import EditorStyle from '../css/view/editor/Editor.module.css';
>>>>>>> a8d6191e9d35ebefa3504f5f8e308f4284681418

function Editor() {
    return (
        <div className={EditorStyle.editorContainer}>
            <SideBar />
            <div className={EditorStyle.editorWrapper}>
            <Routes>
                <Route path="/mypage" element={<Mypage/>} />
                <Route path="/" element={<Editor1 />} />
                {/* <Route path={`/${id}`} element={<Editor1 />} /> */}
            </Routes>
            </div>
        </div>

    )
}

export default Editor;