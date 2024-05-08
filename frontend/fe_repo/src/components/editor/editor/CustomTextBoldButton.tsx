import {
    ToolbarButton,
    useBlockNoteEditor,
    useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function BoldButton() {
    const editor = useBlockNoteEditor();


  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().bold === true
  );
 
  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().bold === true
    );
  }, editor);

    return (
        <ToolbarButton
        mainTooltip={"굵게"}
        secondaryTooltip="Ctrl + B"
        onClick={() => {
          editor.toggleStyles({
            bold: true
          });
        }}
        isSelected={isSelected}>
        굵게
        </ToolbarButton>
    );
}