import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { BlockNoteSchema, DefaultBlockSchema, defaultBlockSpecs, filterSuggestionItems, PartialBlock, Block, uploadToTmpFilesDotOrg_DEV_ONLY } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { CodeBlock, insertCode } from "./CodeBlock";
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react';
import { TerminalBlock, insertTerminal } from "../editor/TerminalBlock";
import _ from 'lodash';
import axios from 'axios';
import useImageUpload from "../../../hooks/editor/useImageUpload";

const Editor1 = () => {
  // 저장을 위해 에디터의 변동 사항을 확인하기 위한 hooks
  const [blocks, setBlocks] = useState<Block[]>([]);
  // 제목의 변동사항을 확인하기 위한 hooks
  const [title, setTitle] = useState('제목입니다22');
  const titleId = "title-id"; // 제목 블록의 고유 ID

  // 이미지 업로드 훅
  const { ImageUpload } = useImageUpload();

  // sideBar에서 id값 꺼내기 위한 hook
  const { fileId } = useParams();
  // const { fileId } = state.id;

  //기본 에디터 + 코드블록 + 터미널블록 사용가능 스키마 설정
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      procode: CodeBlock,
      terminal: TerminalBlock
    },
  });

  // db에서 파일의 id를 통해 content를 조회 api 호출하는 함수
  // 파일 ID를 사용하여 데이터베이스에서 파일 내용을 불러오는 함수
  useEffect(() => {
    const fetchFileContent = async () => {
      if (fileId) {
        try {
          const response = await axios.get(`/api/files/${fileId}`);
          setBlocks(response.data.content); // 상태에 파일 내용 저장
        } catch (error) {
          console.error('Failed to fetch file content:', error);
        }
      }
    };

    fetchFileContent();
  }, [fileId]);

  // 에디터의 내용을 로컬 스토리지에 저장하는 함수
  const saveContentToLocalStorage = (content: any) => {
    const savedData = JSON.stringify(content, null, 4)
    localStorage.setItem('editorContent', savedData);
  }

  // 로컬 스토리지의 내용을 서버에 저장하는 함수
  const saveToServer = () => {
    const localContent = localStorage.getItem('editorContent');
    axios.post('/api/save', { content: localContent })
      .then(response => console.log('Saved successfully!', response))
      .catch(error => console.error('Failed to save:', error));
  }

  // 내용이 변경될 때마다 로컬 스토리지에 저장하고, 서버에 저장하는 작업을 지연시키는 함수
  const debouncedSave = useCallback(_.debounce(saveToServer, 30000), []);

  useEffect(() => {
    saveContentToLocalStorage(blocks);
    debouncedSave();
  }, [blocks, saveContentToLocalStorage, debouncedSave]);

  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: [],
    // 우리 s3에 업로드하는 훅
    uploadFile: ImageUpload
  });

  return (
    <>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
        onChange={() => {
          // Saves the document JSON to state.
          setBlocks(editor.document as unknown as Block[]);
        }}
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
      <div>Document JSON:</div>
      <div className={"item bordered"}>
        <pre>
          <code>{JSON.stringify(blocks, null, 2)}</code>
        </pre>
      </div>
      <p>에디터입니다</p>
    </>
  )

}



export default Editor1;