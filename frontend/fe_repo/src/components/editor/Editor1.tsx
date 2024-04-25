import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { CodeBlock, insertCode } from "./CodeBlock";
import { TerminalBlock, insertTerminal } from "./TerminalBlock";


const Editor1 = () => {
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      procode: CodeBlock,
      terminal: TerminalBlock
    },
  });
  const editor = useCreateBlockNote({
    schema: schema
  }
  );

  return (
    <>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
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
      </BlockNoteView>;
    </>
  )


};

export default Editor1;