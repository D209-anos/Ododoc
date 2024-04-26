import { createReactBlockSpec } from "@blocknote/react";
import { BlockNoteEditor, defaultBlockSpecs, insertOrUpdateBlock } from "@blocknote/core";
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
          placeholder={"Write your mermaid code here..."}
          style={{ width: "100%", resize: "vertical" }}
          //@ts-ignore
          extensions={[langs[data?.language ? data?.language : "javascript"]()]}
          value={data}
          theme={"light"}
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
  title: "Code",
  group: "Other",
  onItemClick: (editor: BlockNoteEditor) => {
    insertOrUpdateBlock(editor, {
      //@ts-ignore
      type: TYPE,
    });
  },
  aliases: ["code"],
  icon: <MdCode />,
  subtext: "Insert a code block.",
});