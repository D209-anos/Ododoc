import {
  ToolbarButton,
  useBlockNoteEditor,
  useEditorContentOrSelectionChange,
  useSelectedBlocks,
} from "@blocknote/react";
import {
  BlockSchema,
  checkBlockHasDefaultProp,
  checkBlockTypeHasDefaultProp,
  DefaultProps,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { IconType } from "react-icons";
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
} from "react-icons/ri";
import { useCallback, useMemo, useState } from "react";

type TextAlignment = DefaultProps["textAlignment"];

const icons: Record<TextAlignment, IconType> = {
  left: RiAlignLeft,
  center: RiAlignCenter,
  right: RiAlignRight,
  justify: RiAlignJustify,
}

export const TextAlignButton = (props: { textAlignment: TextAlignment }) => {
  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();

  const selectedBlocks = useSelectedBlocks(editor);

  const textAlignment = useMemo(() => {
    const block = selectedBlocks[0];

    if (checkBlockHasDefaultProp("textAlignment", block, editor)) {
      return block.props.textAlignment;
    }

    return;
  }, [editor, selectedBlocks]);

  const setTextAlignment = useCallback(
    (textAlignment: TextAlignment) => {
      editor.focus();

      for (const block of selectedBlocks) {
        if (checkBlockTypeHasDefaultProp("textAlignment", block.type, editor)) {
          editor.updateBlock(block, {
            props: { textAlignment: textAlignment },
          });
        }
      }
    },
    [editor, selectedBlocks]
  );

  const show = useMemo(() => {
    return !!selectedBlocks.find((block) => "textAlignment" in block.props);
  }, [selectedBlocks]);

  if (!show) {
    return null;
  }

  const tooltipMap: Record<TextAlignment, string> = {
    left: "왼쪽 정렬",
    center: "중앙 정렬",
    right: "오른쪽 정렬",
    justify: "양쪽 정렬"
  };

  return (
    <ToolbarButton
      onClick={() => setTextAlignment(props.textAlignment)}
      isSelected={textAlignment === props.textAlignment}
      mainTooltip={
        props.textAlignment === "justify"
          ? "Justify Text"
          : 
          tooltipMap[props.textAlignment]
      }
      icon={icons[props.textAlignment]}
    />
  );
}