import {
    ToolbarButton,
    useBlockNoteEditor,
    useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function StrikeButton() {
    const editor = useBlockNoteEditor();


  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().strike === true
  );
 
  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().strike === true
    );
  }, editor);

    return (
        <ToolbarButton
        mainTooltip={"취소선"}
        onClick={() => {
          editor.toggleStyles({
            strike: true
          });
        }}
        isSelected={isSelected}>
        취소선
        </ToolbarButton>
    );
}