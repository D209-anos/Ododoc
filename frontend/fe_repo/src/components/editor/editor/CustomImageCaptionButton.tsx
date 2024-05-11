import {
    BlockSchema,
    checkBlockIsDefaultType,
    checkDefaultBlockTypeInSchema,
    InlineContentSchema,
    StyleSchema,
  } from "@blocknote/core";
  import {
    ChangeEvent,
    KeyboardEvent,
    useCallback,
    useMemo,
    useState,
  } from "react";
  import { RiText } from "react-icons/ri";
  
  import { useBlockNoteEditor, useSelectedBlocks, ToolbarButton } from "@blocknote/react";
  import { ToolbarInputsMenu } from "./CustomToolbarInputsMenu"
  import { ToolbarInputsMenuItem } from "./CustomToolbarInputsMenuItem";
  
  export const ImageCaptionButton = () => {
    const editor = useBlockNoteEditor<
      BlockSchema,
      InlineContentSchema,
      StyleSchema
    >();
  
    const [currentEditingCaption, setCurrentEditingCaption] = useState<string>();
  
    const selectedBlocks = useSelectedBlocks(editor);
  
    const imageBlock = useMemo(() => {
      // Checks if only one block is selected.
      if (selectedBlocks.length !== 1) {
        return undefined;
      }
  
      const block = selectedBlocks[0];
  
      if (checkBlockIsDefaultType("image", block, editor)) {
        return block;
      }
  
      return undefined;
    }, [editor, selectedBlocks]);
  
    const handleEnter = useCallback(
      (event: KeyboardEvent) => {
        if (
          imageBlock &&
          checkDefaultBlockTypeInSchema("image", editor) &&
          event.key === "Enter"
        ) {
          event.preventDefault();
          editor.updateBlock(imageBlock, {
            type: "image",
            props: {
              caption: currentEditingCaption,
            },
          });
        }
      },
      [currentEditingCaption, editor, imageBlock]
    );
  
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) =>
        setCurrentEditingCaption(event.currentTarget.value),
      []
    );
  
    if (!imageBlock) {
      return null;
    }
  
    return (
      <ToolbarInputsMenu
        button={
          <ToolbarButton
            mainTooltip={"캡션 넣기"}
            icon={RiText}
            isSelected={imageBlock.props.caption !== ""}
          />
        }
        dropdownItems={
          <ToolbarInputsMenuItem
            type={"text"}
            icon={RiText}
            value={currentEditingCaption}
            autoFocus={true}
            placeholder={"캡션을 넣어주세요"}
            onKeyDown={handleEnter}
            defaultValue={imageBlock.props.caption}
            onChange={handleChange}
          />
        }
      />
    );
  };
  