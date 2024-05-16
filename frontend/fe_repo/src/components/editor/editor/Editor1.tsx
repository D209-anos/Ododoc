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
import EditorDetailStyle from '../../../css/components/editor/Editor1.module.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadToCloudinary } from '../../..//utils/cloudinary';

import { editDirectoryItem, fetchDirectory } from '../../../api/service/directory';
import { fetchFile, saveFile } from '../../../api/service/editor';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { YooptaContentValue } from '@yoopta/editor/dist/editor/types';

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
  const [blocks, setBlocks] = useState<YooptaBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 상태

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
    }
  }, [directoryId, loadData]);

  const handleTitleChange = useCallback(async (event: any) => {
    const newTitle = event.target.innerText;
    setTitle(newTitle);
    if (directoryId && newTitle !== title) {
      try {
        await editDirectoryItem(directoryId, newTitle);
        console.log('Title updated successfully');
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

  const handleEditorChange = useCallback(async () => {
    if (isLoading) return; // 로딩 중에는 변경 사항을 무시
    if (editor.selection) {
      const block = editor.getEditorValue(); // 에디터의 현재 값 가져오기
      setBlocks(block);
      try {
        console.log('저장 할 내용:', JSON.stringify(block, null, 2));
        await saveFile(directoryId, block);
      } catch (error) {
        console.error('파일 저장 실패', error);
      }
    }
  }, [editor, directoryId, isLoading]);

  useEffect(() => {
    editor.on('change', handleEditorChange);
    return () => editor.off('change', handleEditorChange);
  }, [editor, handleEditorChange]);

  return (
    <>
      <div
        className={EditorDetailStyle.container}
        ref={selectionRef}
      >
        <h1 contentEditable="true" onBlur={handleTitleChange} suppressContentEditableWarning={true} onKeyDown={handleKeyDown} className={EditorDetailStyle.editableTitle}>
          {title}
        </h1>
        <hr />
        {isDataLoaded && (
          <YooptaEditor
            key={directoryId}
            editor={editor}
            //@ts-ignore
            plugins={plugins}
            tools={TOOLS}
            marks={MARKS}
            selectionBoxRoot={selectionRef}
            value={documentData}
            autoFocus
            style={{ zIndex: 0, important: 'true' }}
          />
        )}
      </div>
    </>
  );
}

export default Editor1;
