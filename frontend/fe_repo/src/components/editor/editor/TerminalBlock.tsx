import { createReactBlockSpec } from "@blocknote/react";
import { BlockNoteEditor, defaultBlockSpecs, insertOrUpdateBlock } from "@blocknote/core";
import { MdCode } from "react-icons/md";
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

const TYPE = "terminal";

export const TerminalBlock = createReactBlockSpec(
  {
    type: TYPE,
    propSchema: {
      ...defaultBlockSpecs,
      data: {
        //@ts-ignore
        language: "javascript",
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
          placeholder={"Write your terminal code here..."}
          style={{ width: "100%", resize: "vertical", padding: "20px", backgroundColor:"#282c34" }}
          //@ts-ignore
          extensions={[langs[data?.language ? data?.language : "javascript"]()]}
          value={data}
          theme={"dark"}
          editable={editor.isEditable}
          width="100%"
          height="auto"
          onChange={onInputChange}
        />
      );
    },
  }
);

export const insertTerminal = () => ({
  title: "터미널",
  group: "Other",
  onItemClick: (editor: BlockNoteEditor) => {
    insertOrUpdateBlock(editor, {
      //@ts-ignore
      type: TYPE,
    });
  },
  aliases: ["Terminal"],
  icon: <MdCode />,
  subtext: "터미널 스니펫을 작성하세요",
});