import Editor1 from '../components/editor/editor/Editor1';
import SideBar from '../components/editor/sidebar/SideBar';
import EditorStyle from '../css/view/editor/Editor.module.css';

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