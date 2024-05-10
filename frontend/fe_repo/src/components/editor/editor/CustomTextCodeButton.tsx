import {
    ToolbarButton,
    useBlockNoteEditor,
    useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function CodeButton() {
    const editor = useBlockNoteEditor();


  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().code === true
  );
 
  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().code === true
    );
  }, editor);

    return (
        <ToolbarButton
        mainTooltip={"코드"}
        onClick={() => {
          editor.toggleStyles({
            code: true
          });
        }}
        isSelected={isSelected}>
        코드
        </ToolbarButton>
    );
}