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
import EditorStyle from '../../../css/components/editor/Editor1.module.css'
import { useEffect, useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from './initValue';
  // db에서 파일의 id를 통해 content를 조회 api 호출하는 함수
  // 파일 ID를 사용하여 데이터베이스에서 파일 내용을 불러오는 함수
  //서버에서 불러온 데이터를 해당 코드에 집어넣으면 됩니다
  // const { fileId } = useParams();
  // const navigate = useNavigate();
  // const [content, setContent] = useState<Block[]>([
  //   {
  //     "id": "title-id",
  //     "type": "heading",
  //     "props": {
  //       "textColor": "default",
  //       "backgroundColor": "default",
  //       "textAlignment": "left",
  //       "level": 1
  //     },
  //     "content": [
  //       {
  //         "type": "text",
  //         "text": "제목입니다22",
  //         "styles": {}
  //       }
  //     ],
  //     "children": []
  //   },
  //   // {
  //   //   "id": "d837d32c-0fe2-4fc0-b87e-f9d28711f5ff",
  //   //   "type": "paragraph",
  //   //   "props": {
  //   //     "textColor": "default",
  //   //     "backgroundColor": "default",
  //   //     "textAlignment": "left"
  //   //   },
  //   //   "content": [
  //   //     {
  //   //       "type": "text",
  //   //       "text": "서버에서는 JSON 형식으로 데이터를 전송합니다",
  //   //       "styles": {}
  //   //     }
  //   //   ],
  //   //   "children": []
  //   // },
  //   // {
  //   //   "id": "9556e88c-8273-44ad-b593-c27fcf11c870",
  //   //   "type": "paragraph",
  //   //   "props": {
  //   //     "textColor": "default",
  //   //     "backgroundColor": "default",
  //   //     "textAlignment": "left"
  //   //   },
  //   //   "content": [
  //   //     {
  //   //       "type": "text",
  //   //       "text": "이렇게 여러개의 데이터를 어떻게 initailContent에 집어 넣어야 하지?",
  //   //       "styles": {}
  //   //     }
  //   //   ],
  //   //   "children": []
  //   // },
  //   // {
  //   //   "id": "39f00afc-e831-413e-8881-988402d4de8b",
  //   //   //@ts-ignore
  //   //   "type": "procode",
  //   //   //@ts-ignore
  //   //   "props": {},
  //   //   "children": []
  //   // },
  //   // {
  //   //   "id": "2a9131bd-4fe0-4524-ba6d-b0c7f11cbc7e",
  //   //   "type": "paragraph",
  //   //   "props": {
  //   //     "textColor": "default",
  //   //     "backgroundColor": "default",
  //   //     "textAlignment": "left"
  //   //   },
  //   //   "content": [],
  //   //   "children": []
  //   // }
  // ]);

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



  return (
    <>
      <div
        className={EditorStyle.container}
        ref={selectionRef}
      >
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