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
    function handleSelectionChange() {
      if (editor.selection) {
        // 여기서 editor.getBlock을 사용하여 선택된 블록의 상세 정보를 가져올 수 있습니다.
        const block = editor.blocks;
        if (block) {
          //@ts-ignore
          setBlocks([block]);
        }
      }
    }

    editor.on('change', handleSelectionChange);

    return () => {
      editor.off('change', handleSelectionChange);
    };
  }, [editor]);



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