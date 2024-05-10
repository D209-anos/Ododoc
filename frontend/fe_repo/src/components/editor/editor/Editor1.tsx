import YooptaEditor, { YooptaBlock, createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import EditorDetailStyle from '../../../css/components/editor/Editor1.module.css'

import { useEffect, useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from './initValue';
import { uploadToCloudinary } from '../../..//utils/cloudinary';


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
  Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
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

function WithBaseFullSetup() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const [blocks, setBlocks] = useState<YooptaBlock[]>([]);
  const [title, setTitle] = useState('제목입니다');
  useEffect(() => {
    function handleChange(value: any) {
      console.log('value', value);
    }
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor]);

  useEffect(() => {
    function handleEditorChange() {
      // 에디터 전체의 현재 상태를 가져오는 로직 (예시)
      // 에디터의 선택 영역이 있을 때만 getBlock을 호출
      if (editor.selection) {
        const block = editor.getEditorValue(); // 올바른 매개변수 형식을 전달
        setBlocks(block);
      }
    }

    editor.on('change', handleEditorChange); // 에디터의 변경사항 감지

    return () => {
      editor.off('change', handleEditorChange); // 클린업 함수에서 이벤트 리스너 제거
    };
  }, [editor]); // 의존성 배열에 editor 추가

  const handleTitleChange = (event : any) => {
    setTitle(event.target.innerText);
  };

  return (
    <>
      <div
        className={EditorDetailStyle.container}
        ref={selectionRef}
      >
        <p>
          <h1 contentEditable="true" onBlur={handleTitleChange} className={EditorDetailStyle.editableTitle}>
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
          //@ts-ignore
          value={WITH_BASIC_INIT_VALUE}
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

export default WithBaseFullSetup;