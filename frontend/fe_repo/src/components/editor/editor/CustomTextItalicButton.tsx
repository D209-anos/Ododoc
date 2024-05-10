import {
    ToolbarButton,
    useBlockNoteEditor,
    useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function ItalicButton() {
    const editor = useBlockNoteEditor();


  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().italic === true
  );
 
  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().italic === true
    );
  }, editor);

    return (
        <ToolbarButton
        mainTooltip={"기울이기"}
        secondaryTooltip="Ctrl + I"
        onClick={() => {
          editor.toggleStyles({
            italic: true
          });
        }}
        isSelected={isSelected}>
        기울이기
        </ToolbarButton>
    );
}