import {
    ToolbarButton,
    useBlockNoteEditor,
    useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function UnderlineButton() {
    const editor = useBlockNoteEditor();


  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().underline === true
  );
 
  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().underline === true
    );
  }, editor);

    return (
        <ToolbarButton
        mainTooltip={"밑줄"}
        secondaryTooltip="Ctrl + U"
        onClick={() => {
          editor.toggleStyles({
            underline: true
          });
        }}
        isSelected={isSelected}>
        밑줄
        </ToolbarButton>
    );
}