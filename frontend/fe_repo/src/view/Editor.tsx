import Editor1 from '../components/editor/Editor1';
import SideBar from '../../src/components/editor/SideBar';
import EditorStyle from '../css/view/Editor.module.css';

function Editor() {
    return (
        <div className={EditorStyle.editorContainer}>
            <SideBar />
            <div className={EditorStyle.editorWrapper}>
                <Editor1  />
            </div>
        </div>

    )
}

export default Editor;