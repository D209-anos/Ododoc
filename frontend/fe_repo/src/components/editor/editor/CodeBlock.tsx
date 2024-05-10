import { createReactBlockSpec, ToolbarButton, useBlockNoteEditor  } from "@blocknote/react";
import { BlockNoteEditor, defaultBlockSpecs, insertOrUpdateBlock  } from "@blocknote/core";
import { MdCode } from "react-icons/md";
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";


const TYPE = "procode";

export const CodeBlock = createReactBlockSpec(
  {
    type: TYPE,
    propSchema: {
      ...defaultBlockSpecs,
      data: {
        //@ts-ignore
        language: {
          default : "javascript",
          values : ["javascript","python","java","csharp"]
        },
        code: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const { data } = block?.props;
      const onInputChange = (val: string) => {
        editor.updateBlock(block, {
          //@ts-ignore
          props: { ...block.props, data: val },
        });
      };

      return (
        <ReactCodeMirror
          id={block?.id}
          autoFocus
          placeholder={"코드를 작성하세요..."}
          style={{ width: "100%", resize: "vertical", padding: "20px", backgroundColor:"#f7f6f3", borderRadius:"5px" }}
          //@ts-ignore
          extensions={[langs[data?.language ? data?.language : "javascript"]()]}
          value={data}
          theme={"none"}
          editable={editor.isEditable}
          width="100%"
          height="auto"
          onChange={onInputChange}
        />
      );
    },
  }
);

export const insertCode = () => ({
  title: "코드",
  group: "Other",
  onItemClick: (editor: BlockNoteEditor) => {
    insertOrUpdateBlock(editor, {
      //@ts-ignore
      type: TYPE,
    });
  },
  aliases: ["code"],
  icon: <MdCode />,
  subtext: "코드 스니펫을 작성하세요",
});
