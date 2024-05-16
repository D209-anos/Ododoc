import YooptaEditor, { YooptaBlock, createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import EditorDetailStyle from '../../../css/components/editor/Editor1.module.css'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadToCloudinary } from '../../..//utils/cloudinary';

import { editDirectoryItem, fetchDirectory } from '../../../api/service/directory';
import { fetchFile, saveFile } from '../../../api/service/editor'
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useDirectory } from '../../../contexts/DirectoryContext';

interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  // Video.extend({
  //   options: {
  //     onUpload: async (file) => {
  //       const data = await uploadToCloudinary(file, 'video');
  //       return {
  //         src: data.secure_url,
  //         alt: 'cloudinary',
  //         sizes: {
  //           width: data.width,
  //           height: data.height,
  //         },
  //       };
  //     },
  //   },
  // }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return { src: response.url };
      },
    },
  }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function Edito1() {
  const { state, dispatch } = useAuth();
  const { accessToken, rootId } = state;
  const location = useLocation();
  const directoryId = location.state;
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const [title, setTitle] = useState();
  const [documentData, setDocumentData] = useState();
  const [blocks, setBlocks] = useState<YooptaBlock[]>([]);

  const { directoryData, setDirectoryData } = useDirectory();

  console.log('fetchDirectory : ' + fetchDirectory(rootId))

  //제목 조회하기
  //파일 내용 조회하기
  useEffect(() => {
    const loadData = async () => {
      try {
        const fileData = await fetchFile(directoryId);
        setDocumentData(fileData.contnet);
        setTitle(fileData.title)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (directoryId) {
      loadData();
    }
  }, [directoryId]);

  // 제목 변경 이벤트 핸들러
  const handleTitleChange = useCallback(async (event: any) => {
    const newTitle = event.target.innerText;
    setTitle(newTitle);
    if (directoryId && newTitle !== title) {
      try {
        await editDirectoryItem(directoryId, newTitle);
        console.log('Title updated successfully');

        if (directoryData) {
          const updatedData = updateDirectoryItemTitle(directoryData, directoryId, newTitle);
          setDirectoryData(updatedData);
        }
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    }
  }, [directoryId, title, directoryData, setDirectoryData]);

  // directoryData 내의 특정 항목의 제목을 업데이트하는 함수
  const updateDirectoryItemTitle = (data: MyDirectoryItem, targetId: number, newTitle: string): MyDirectoryItem => {
    if (data.id === targetId) {
      return { ...data, name: newTitle };
    }

    if (Array.isArray(data.children)) {
      const updatedChildren = data.children.map(child => {
        if (typeof child === 'object') {
          return updateDirectoryItemTitle(child, targetId, newTitle);
        }
        return child;
      });
      return { ...data, children: updatedChildren };
    }

    return data;
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 Enter 키 동작 방지
      event.target.blur(); // 포커스 해제
    }
  };

  // 파일 변경시 저장하기
  const handleEditorChange = useCallback(async () => {
    if (editor.selection) {
      const block = editor.getEditorValue(); // 에디터의 현재 값 가져오기
      setBlocks(block)
      // API 호출을 통해 서버에 저장
      try {
        console.log('저장 할 내용:', JSON.stringify(block, null, 2));
        await saveFile(directoryId, block);
      } catch (error) {
        console.error('파일 저장 실패', error);
      }
    }
  }, [editor, directoryId]);

  useEffect(() => {
    editor.on('change', handleEditorChange);
    return () => editor.off('change', handleEditorChange);
  }, [editor, handleEditorChange]);


  console.log("directoryId : " + directoryId)

  return (
    <>
      <div
        className={EditorDetailStyle.container}
        ref={selectionRef}
      >
        <p>
          <h1 
            contentEditable="true" 
            onBlur={handleTitleChange} 
            suppressContentEditableWarning={true} 
            onKeyDown={handleKeyDown} 
            className={EditorDetailStyle.title}
          >
            {title}
          </h1>
        </p>
        <hr />
        <YooptaEditor
          editor={editor}
          //@ts-ignore
          plugins={plugins}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          // readOnly = {true}
          //@ts-ignore
          value={documentData}
          autoFocus
          style={{ zIndex: 0, important: 'true' }}
        />
      </div>
      <div>
        <div>Document JSON:</div>
        <div>
          <pre>
            <code>{JSON.stringify(blocks, null, 2)}</code>
          </pre>
        </div>
      </div>
    </>
  );
}

export default Edito1;