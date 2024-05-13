import YooptaEditor, { YooptaBlock, createYooptaEditor } from "@yoopta/editor";

import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Code from "@yoopta/code";
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import EditorDetailStyle from "../../../css/components/editor/Editor1.module.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { uploadToCloudinary } from "../../..//utils/cloudinary";

import {
  editDirectoryItem,
  fetchDirectory,
} from "../../../api/service/directory";
import { fetchFile, saveFile } from "../../../api/service/editor";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { WITH_BASIC_INIT_VALUE } from "./initValue";

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
        const data = await uploadToCloudinary(file, "image");

        return {
          src: data.secure_url,
          alt: "cloudinary",
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
        const response = await uploadToCloudinary(file, "auto");
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

  useEffect(() => {
    function handleEditorChange() {
      // 에디터 전체의 현재 상태를 가져오는 로직 (예시)
      // 에디터의 선택 영역이 있을 때만 getBlock을 호출
      if (editor.selection) {
        const block = editor.getEditorValue(); // 올바른 매개변수 형식을 전달
        setBlocks(block);
      }
    }

    editor.on("change", handleEditorChange); // 에디터의 변경사항 감지

    return () => {
      editor.off("change", handleEditorChange); // 클린업 함수에서 이벤트 리스너 제거
    };
  }, [editor]); // 의존성 배열에 editor 추가

  //제목 조회하기
  useEffect(() => {
    // 디렉토리 정보를 로드하고, 해당하는 파일의 이름을 제목으로 설정
    const loadDirectoryAndSetTitle = async () => {
      if (directoryId) {
        try {
          const directoryData = await fetchDirectory(rootId); // API 호출
          const file = findFileById(directoryData, directoryId);
          if (file && file.type === "FILE") {
            setTitle(file.name); // 파일 이름을 제목으로 설정
          }
        } catch (error) {
          console.error("Error fetching directory:", error);
        }
      }
    };

    loadDirectoryAndSetTitle();
  }, [directoryId]);

  // ID를 사용하여 데이터 내에서 파일 객체를 찾는 함수
  //@ts-ignore
  function findFileById(data, id) {
    if (data.id === id && data.type === "FILE") {
      return data; // 일치하는 파일 찾기
    }
    if (data.children) {
      for (const child of data.children) {
        //@ts-ignore
        const found = findFileById(child, id);
        if (found) return found; // 재귀적으로 찾기
      }
    }
    return null;
  }
  console.log("fetchDirectory : " + fetchDirectory(rootId));
  //파일 내용 조회하기

  // 제목 변경 이벤트 핸들러
  const handleTitleChange = async (event: any) => {
    const newTitle = event.target.innerText;
    setTitle(newTitle); // 상태 업데이트

    // 제목이 변경되었으면 서버에 저장
    if (directoryId && newTitle !== title) {
      // 현재 제목과 새 제목이 다를 경우에만 요청
      try {
        const response = await editDirectoryItem(directoryId, newTitle);
        console.log("Title updated successfully:", response);
        // 여기에 추가적인 성공 처리 로직을 추가할 수 있습니다.
      } catch (error) {
        console.error("Failed to update title:", error);
        // 에러 처리 로직
      }
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 Enter 키 동작 방지
      event.target.blur(); // 포커스 해제
    }
  };

  // 파일 변경시 저장하기
  useEffect(() => {
    const handleEditorChange = async () => {
      if (directoryId) {
        // 에디터에서 현재 콘텐츠 값 가져오기
        const content = editor.getEditorValue();
        try {
          await saveFile("save", directoryId, content);
        } catch (error) {
          console.error("Failed to save File:");
        }
      }
    };

    // editor의 change 이벤트에 handleEditorChange 함수를 등록
    editor.on("change", handleEditorChange);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
    return () => {
      editor.off("change", handleEditorChange);
    };
  }, [editor, directoryId]); // 의존성 배열에 editor와 directoryId를 포함

  console.log("directoryId : " + directoryId);

  return (
    <>
      <div className={EditorDetailStyle.container} ref={selectionRef}>
        <p>
          <h1
            contentEditable="true"
            onBlur={handleTitleChange}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
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
          value={WITH_BASIC_INIT_VALUE}
          autoFocus
          style={{ zIndex: 0, important: "true" }}
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
