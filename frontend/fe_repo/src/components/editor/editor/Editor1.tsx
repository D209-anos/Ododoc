import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
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
import EditorDetailStyle from '../../../css/components/editor/Editor1.module.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadToCloudinary } from '../../..//utils/cloudinary';
import { fetchFile } from '../../../api/service/editor';
import { editDirectoryItem } from '../../../api/service/directory';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { YooptaContentValue } from '@yoopta/editor/dist/editor/types';
import { useEditorContext } from '../../../contexts/EditorContext';
import { useDirectory } from '../../../contexts/DirectoryContext';


interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}



const convertApiResponseToEditorFormat = (apiResponse: any): YooptaContentValue => {
  const content = apiResponse.content;
  const result: YooptaContentValue = {};

  Object.keys(content).forEach((key) => {
    const item = content[key];
    result[item.id] = {
      id: item.id,
      type: item.type,
      value: item.value.map((valueItem: any) => ({
        ...valueItem,
        children: valueItem.children.map((child: any) => ({
          ...child,
          text: child.text || '',
        })),
        props: {
          ...valueItem.props,
        },
      })),
      meta: {
        ...item.meta,
        order: item.meta?.order ?? 0,
        depth: item.meta?.depth ?? 0,
      },
    };
  });

  return result;
};

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

function Editor1() {
  const { state } = useAuth();
  const { rootId } = state;
  const location = useLocation();
  const directoryId = location.state;
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const [title, setTitle] = useState('');
  const [documentData, setDocumentData] = useState<YooptaContentValue>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 상태
  const { isDarkMode } = useDarkMode();
  const { directoryData, setDirectoryData} = useDirectory();
  const { editorData, updateEditorData, setCurrentId, saveToServer } = useEditorContext(); // useEditorContext에서 필요한 값들을 가져옵니다.

  const loadData = useCallback(async (dirId : any) => {
    setIsLoading(true);
    try {
      const fileData = await fetchFile(dirId);
      setTitle(fileData.title);
      const convertedData = convertApiResponseToEditorFormat(fileData);
      setDocumentData(convertedData);
      setIsDataLoaded(true); // 데이터 로드 완료 설정
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (directoryId) {
      loadData(directoryId);
      setIsDataLoaded(false); // 데이터 로드 시작 설정
      setCurrentId(directoryId); // 현재 directoryId 설정
    }
  }, [directoryId, loadData, setCurrentId]);

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
  }, [directoryId, title]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 Enter 키 동작 방지
      event.target.blur(); // 포커스 해제
    }
  };

  const handleEditorChange = useCallback(() => {
    if (isLoading) return; // 로딩 중에는 변경 사항을 무시
    if (editor.selection) {
      const block = editor.getEditorValue(); // 에디터의 현재 값 가져오기
      updateEditorData(directoryId, block); // 전역 상태 업데이트
    }
  }, [editor, directoryId, isLoading, updateEditorData]);

  useEffect(() => {
    editor.on('change', handleEditorChange);
    return () => editor.off('change', handleEditorChange);
  }, [editor, handleEditorChange]);


  // directory 이름 업데이트
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

  // 페이지를 떠나기 전에 저장
  useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      await saveToServer(directoryId);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveToServer, directoryId]);

  // 페이지 숨김 상태에서도 저장
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        await saveToServer(directoryId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveToServer, directoryId]);

  // 5분마다 서버로 저장
  useEffect(() => {
    const interval = setInterval(() => saveToServer(directoryId), 300000); // 5분 = 300,000ms
    return () => clearInterval(interval);
  }, [directoryId, saveToServer]);


  return (
    <>
      <div
        className={`${EditorDetailStyle.container} ${isDarkMode ? EditorDetailStyle.darkMode : ''}`}
        ref={selectionRef}
      >
        <h1 contentEditable="true" onBlur={handleTitleChange} suppressContentEditableWarning={true} onKeyDown={handleKeyDown} className={EditorDetailStyle.editableTitle}>
          {title}
        </h1>
        <hr className={EditorDetailStyle.titleLine}/>
        <div className={EditorDetailStyle.yooptaEditor}>
          {isDataLoaded && (
            <YooptaEditor
              key={directoryId}
              editor={editor}
              //@ts-ignore
              plugins={plugins}
              tools={TOOLS}
              marks={MARKS}
              selectionBoxRoot={selectionRef}
              //@ts-ignore
              value={documentData}
              autoFocus
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Editor1;
