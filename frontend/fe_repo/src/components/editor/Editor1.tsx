import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { BlockNoteSchema, DefaultBlockSchema, defaultBlockSpecs, filterSuggestionItems, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { CodeBlock, insertCode } from "./CodeBlock";
import { TerminalBlock, insertTerminal } from "./TerminalBlock";
import React, { useState, useEffect } from 'react';


const Editor1 = () => {
  const [title, setTitle] = useState('제목입니다22');
  const titleId = "title-id"; // 제목 블록의 고유 ID

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      procode: CodeBlock,
      terminal: TerminalBlock
    },
  });

  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: [{
      id: titleId,
      type: "heading",
      props: {
        level: 1,
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      content: title,
      children: [],
    }]
  });

  // 블록 추가 예제
  const addBlock = () => {
    const newBlock = {
      type: 'paragraph',
      props: {
        text: 'Another new paragraph block!',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left'
      }
    };

    // 블록 스키마에 맞게 newBlock을 캐스팅합니다. 여기서는 예제로써 간단하게 처리하며,
    // 실제로는 PartialBlock<BSchema, ISchema, SSchema> 타입을 만족시키는 객체를 생성해야 합니다.
    const blockToInsert = [newBlock as PartialBlock<DefaultBlockSchema>];

    editor.insertBlocks(blockToInsert, 'document-end', 'after'); // 문서 끝에 새 블록 추가
  };

  // 제목이 변경되었는지 확인하고 서버에 업데이트
  const handleEditorChange = () => {
    const currentTitleBlock = editor.getBlock(titleId);
    console.log(currentTitleBlock?.content)
    if (currentTitleBlock && Array.isArray(currentTitleBlock.content) && currentTitleBlock.content.length > 0) {
      const contentItem = currentTitleBlock.content[0];
      let newTitle = '';

      // contentItem 타입이 StyledText 또는 Link인 경우 처리
      if (contentItem.type === 'text' && contentItem.text) {
        newTitle = contentItem.text; // StyledText의 경우 직접 텍스트 사용
      } else if (contentItem.type === 'link' && contentItem.content && contentItem.content.length > 0) {
        // Link의 경우 content 배열의 첫 번째 StyledText 객체에서 텍스트 추출
        newTitle = contentItem.content[0].text;
      }

      // 새로운 제목과 이전 제목을 비교하고 상태 및 데이터베이스 업데이트
      if (newTitle && newTitle !== title) {
        setTitle(newTitle);
        updateTitleInDatabase(newTitle);
        saveEditorContentToServer();
      }
    }
  };

  // 서버에 제목을 업데이트하는 함수
  const updateTitleInDatabase = async (newTitle: any) => {
    try {
      await fetch('/api/titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      console.log("Title updated successfully");
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const saveEditorContentToServer = async () => {
    // const content = editor.document; // 가정: 에디터 상태를 가져오는 메서드

    const currentTitleBlock = editor.getBlock(titleId);
    if (currentTitleBlock && Array.isArray(currentTitleBlock.content) && currentTitleBlock.content.length > 0){
      console.log("내용불러오기" + currentTitleBlock.content[0]);
    }
    try {
      await fetch('/api/editor-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ content }) // 전체 에디터 내용을 JSON으로 변환하여 전송
      });
      console.log("Editor content saved successfully");
    } catch (error) {
      console.error("Failed to save editor content:", error);
    }
  };

  return (
    <>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
        onChange={handleEditorChange}
      >
        {/* @ts-ignore */}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor), insertCode(), insertTerminal()],
              query
            )
          }
        />
      </BlockNoteView>
    </>
  )

}



export default Editor1;