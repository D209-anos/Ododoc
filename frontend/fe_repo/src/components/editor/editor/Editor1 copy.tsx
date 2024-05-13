import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, Block, uploadToTmpFilesDotOrg_DEV_ONLY, } from "@blocknote/core";
import {
  BlockNoteView,
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  SideMenuController,
  SideMenu,
  RemoveBlockItem,
  DragHandleMenu,
  FormattingToolbarController,
  FormattingToolbar,
} from "@blocknote/react";
import { CodeBlock, insertCode } from "./CodeBlock";
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react';
import { TerminalBlock, insertTerminal } from "../editor/TerminalBlock";
import _, { isNull } from 'lodash';
import axios from 'axios';
import { BoldButton } from "./CustomTextBoldButton";
import { CodeButton } from "./CustomTextCodeButton";
import { ItalicButton } from "./CustomTextItalicButton";
import { StrikeButton } from "./CustomTextStrikeButton";
import { UnderlineButton } from "./CustomTextUnderlineButton";
import { TextAlignButton } from "./CustomTextAlignButton";
import { ColorStyleButton } from "./CustomColorButton"
import { BlockColorsItem } from "./CustomBlockColorItem"
import {
  NestBlockButton,
  UnnestBlockButton
} from "./CustomNestBlockButtons"
import { CreateLinkButton } from "./CustomCreateLinkButton"
import { ImageCaptionButton } from "./CustomImageCaptionButton"
import { ReplaceImageButton } from "./CustomReplaceImageButton"
import { BlockTypeSelect } from "./CustomBlockTypeSelect"

const Editor1 = () => {
  // 저장을 위해 에디터의 변동 사항을 확인하기 위한 hooks
  const [blocks, setBlocks] = useState<Block[]>([]);
  // 제목의 변동사항을 확인하기 위한 hooks
  const [title, setTitle] = useState('제목입니다22');
  const titleId = "title-id"; // 제목 블록의 고유 ID

  // db에서 파일의 id를 통해 content를 조회 api 호출하는 함수
  // 파일 ID를 사용하여 데이터베이스에서 파일 내용을 불러오는 함수
  //서버에서 불러온 데이터를 해당 코드에 집어넣으면 됩니다
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Block[]>([
    {
      "id": "title-id",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "제목입니다22",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "d837d32c-0fe2-4fc0-b87e-f9d28711f5ff",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "서버에서는 JSON 형식으로 데이터를 전송합니다",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "9556e88c-8273-44ad-b593-c27fcf11c870",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "이렇게 여러개의 데이터를 어떻게 initailContent에 집어 넣어야 하지?",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "39f00afc-e831-413e-8881-988402d4de8b",
      //@ts-ignore
      "type": "procode",
      //@ts-ignore
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        //@ts-ignore
        "data" : "코드블록입니다."
      },
      "children": []
    },
    {
      "id": "2a9131bd-4fe0-4524-ba6d-b0c7f11cbc7e",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
   
  ]);

  // // 파일 데이터를 서버에서 불러오는 함수
  // useEffect(() => {
  //   const fetchFileData = async () => {
  //     try {
  //       const response = await axios.get(`https://k10d209.p.ssafy.io/api/directory/${fileId}`);
  //       // setContent(response.data); // 서버로부터 받은 데이터를 상태에 저장
  //     } catch (error) {
  //       console.error('Failed to fetch file data:', error);
  //       navigate('/error'); // 에러 발생 시 에러 페이지로 리디렉션
  //     }
  //   };

  //   fetchFileData();
  // }, [fileId, navigate]);

  // 이미지 업로드 훅
  // const { ImageUpload } = useImageUpload();


  //기본 에디터 + 코드블록 + 터미널블록 사용가능 스키마 설정
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      procode: CodeBlock,
      terminal: TerminalBlock 
    },
  });

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
    placeholders: {
      default: "글을 작성하거나 명령어를 사용하려면 '/'키를 누르세요",
      heading: "제목 입력",
      bulletListItem: "리스트",
      numberedListItem: "리스트",
    },
    initialContent: [
      {
        "type": "heading",
        "content": [
          {
            "type": "text",
            "text": "제목입니다22",
            "styles": {}
          }
        ],
      },
      {
        "id": "d837d32c-0fe2-4fc0-b87e-f9d28711f5ff",
        "type": "paragraph",
        "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
        },
        "content": [
          {
            "type": "text",
            "text": "서버에서는 JSON 형식으로 데이터를 전송합니다",
            "styles": {}
          }
        ],
        "children": []
      },
      {
        "id": "9556e88c-8273-44ad-b593-c27fcf11c870",
        "type": "paragraph",
        "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
        },
        "content": [
          {
            "type": "text",
            "text": "이렇게 여러개의 데이터를 어떻게 initailContent에 집어 넣어야 하지?",
            "styles": {}
          }
        ],
        "children": []
      },
      {
        "id": "39f00afc-e831-413e-8881-988402d4de8b",
        "type": "procode",
        "props": {
          //@ts-ignore
          "data" : "코드블록입니다."
        },
        "children": []
      },
      {
        "id": "2a9131bd-4fe0-4524-ba6d-b0c7f11cbc7e",
        "type": "paragraph",
        "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
        },
        "content": [],
        "children": []
      },
     
    ],
    uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
    // uploadFile: ImageUpload
  });

  // 슬래시 메뉴 한글로 변환
  const getItemsWithKoreanTitles = async (query: any) => {
    const defaultItems = await getDefaultReactSlashMenuItems(editor);
    const translatedItems = defaultItems.map(item => ({
      ...item,
      title: translateTitleToKorean(item.title), // 한글로 번역하는 함수
      subtext: translateSubTextToKorean(item.subtext ?? "")
    }));
    return filterSuggestionItems([...translatedItems, insertCode(), insertTerminal()], query);
  };

  function translateTitleToKorean(title: string): string {
    const titleMap: { [key: string]: string } = {
      "Heading 1": "제목 1",
      "Heading 2": "제목 2",
      "Heading 3": "제목 3",
      "Numbered List": "번호 매기기 목록",
      "Bullet List": "글머리 기호 목록",
      "Paragraph": "텍스트",
      "Table": "표",
      "Image": "이미지"
    };
    return titleMap[title] || title;
  }

  function translateSubTextToKorean(subtext: string): string {
    const subtextmap: { [key: string]: string } = {
      "Used for a top-level heading": "섹션제목(대)",
      "Used for key sections": "섹션제목(중)",
      "Used for subsections and group headings": "섹션제목(소)",
      "Used to display a numbered list": "번호 매기기 목록을 생성하세요",
      "Used to display an unordered list": "글머리 기호 목록을 생성하세요",
      "Used for the body of your document": "일반 텍스트를 사용해 쓰기를 시작하세요",
      "Used for for tables": "간단한 표를 페이지에 추가합니다",
      "Insert an image": "파일을 업로드하거나 링크를 이용해 임베드하세요"
    };
    return subtextmap[subtext] || subtext;
  }

  // 이벤트 핸들러 설정
  const handleBackspace = (event: any) => {
    if (event.key === 'Backspace') {
      // const selection = editor.getTextCursorPosition();
      const selection = editor.getTextCursorPosition();

      console.log("선택한 블록" + selection.block.content);
      if (!selection || !selection.block.content) return;
      // if (blockIndex <= 0) return;  // 첫 번째 블록인 경우 이전 블록이 없음
      // const previousBlock = editor.document[blockIndex - 1];

      if (Array.isArray(selection.block.content) && selection.block.content.length === 0) {
        console.log(1111);
        // 이전 블록이 코드블록인지 확인
        if (selection.prevBlock?.type === 'procode' || selection.prevBlock?.type === 'terminal') {
          console.log(2222);

          event.preventDefault(); // 기본 동작 방지
          const confirmDelete = window.confirm("코드 블록을 삭제하시겠습니까?");
          if (confirmDelete) {
            // 사용자가 확인한 경우, 코드 블록 삭제
            console.log(3333);

            editor.removeBlocks([selection.prevBlock?.id]);
          }
        }
      }
    }
  };

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('keydown', handleBackspace);
    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [editor]); // 의존성 배열에 editor 추가


  return (
    <>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
        formattingToolbar={false}
        sideMenu={false}
        onSelectionChange={() => {
          // 커서 위치에서 현재 선택된 블록의 ID를 가져옴
          const selection = editor.getTextCursorPosition();
          console.log(selection);
          if (!selection || !selection.block.content) return;
          // Saves the document JSON to state.
          setBlocks(selection.prevBlock as unknown as Block[]);
        }}
      >
        {/* @ts-ignore */}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={getItemsWithKoreanTitles}
        />
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu
              {...props}
              dragHandleMenu={(props) => (
                <DragHandleMenu {...props}>
                  <RemoveBlockItem {...props}>삭제</RemoveBlockItem>
                  <BlockColorsItem {...props}>색상</BlockColorsItem>
                </DragHandleMenu>
              )}
            />
          )}
        />
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={"blockTypeSelect"} />

              <ImageCaptionButton key={"imageCaptionButton"} />
              <ReplaceImageButton key={"replaceImageButton"} />
              <BoldButton key={"customBoldButton"} />
              <ItalicButton key={"customItalicButton"} />
              <UnderlineButton key={"customUnderlineButton"} />
              <StrikeButton key={"customStrikeButton"} />
              <CodeButton key={"customCodeButton"} />
              <TextAlignButton
                textAlignment={"left"}
                key={"textAlignLeftButton"}
              />
              <TextAlignButton
                textAlignment={"center"}
                key={"textAlignCenterButton"}
              />
              <TextAlignButton
                textAlignment={"right"}
                key={"textAlignRightButton"}
              />

              <ColorStyleButton key={"colorStyleButton"} />

              <NestBlockButton key={"nestBlockButton"} />
              <UnnestBlockButton key={"unnestBlockButton"} />

              <CreateLinkButton key={"createLinkButton"} />
            </FormattingToolbar>
          )}
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

