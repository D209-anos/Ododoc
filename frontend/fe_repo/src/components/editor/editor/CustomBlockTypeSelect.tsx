import {
    Block,
    BlockSchema,
    checkDefaultBlockTypeInSchema,
    DefaultBlockSchema,
    InlineContentSchema,
    StyleSchema,
  } from "@blocknote/core";
  import { useMemo, useState } from "react";
  import type { IconType } from "react-icons";
  import {
    RiH1,
    RiH2,
    RiH3,
    RiListOrdered,
    RiListUnordered,
    RiText,
  } from "react-icons/ri";
  
  import { useBlockNoteEditor, useEditorContentOrSelectionChange, useSelectedBlocks, ToolbarSelect, } from "@blocknote/react";

  import { ToolbarSelectItemProps } from "./CustomToolbarSelectItem";
  
  export type BlockTypeSelectItem = {
    name: string;
    type: string;
    props?: Record<string, boolean | number | string>;
    icon: IconType;
    isSelected: (
      block: Block<BlockSchema, InlineContentSchema, StyleSchema>
    ) => boolean;
  };
  
  export const blockTypeSelectItems: BlockTypeSelectItem[] = [
    {
      name: "본문",
      type: "paragraph",
      icon: RiText,
      isSelected: (block) => block.type === "paragraph",
    },
    {
      name: "제목 1",
      type: "heading",
      props: { level: 1 },
      icon: RiH1,
      isSelected: (block) =>
        block.type === "heading" &&
        "level" in block.props &&
        block.props.level === 1,
    },
    {
      name: "제목 2",
      type: "heading",
      props: { level: 2 },
      icon: RiH2,
      isSelected: (block) =>
        block.type === "heading" &&
        "level" in block.props &&
        block.props.level === 2,
    },
    {
      name: "제목 3",
      type: "heading",
      props: { level: 3 },
      icon: RiH3,
      isSelected: (block) =>
        block.type === "heading" &&
        "level" in block.props &&
        block.props.level === 3,
    },
    {
      name: "머리글 기호 리스트",
      type: "bulletListItem",
      icon: RiListUnordered,
      isSelected: (block) => block.type === "bulletListItem",
    },
    {
      name: "번호 매기기 리스트",
      type: "numberedListItem",
      icon: RiListOrdered,
      isSelected: (block) => block.type === "numberedListItem",
    },
  ];
  
  export const BlockTypeSelect = (props: { items?: BlockTypeSelectItem[] }) => {
    const editor = useBlockNoteEditor<
      BlockSchema,
      InlineContentSchema,
      StyleSchema
    >();
  
    const selectedBlocks = useSelectedBlocks(editor);
  
    const [block, setBlock] = useState(editor.getTextCursorPosition().block);
  
    const filteredItems: BlockTypeSelectItem[] = useMemo(() => {
      return (props.items || blockTypeSelectItems).filter((item) =>
        checkDefaultBlockTypeInSchema(
          item.type as keyof DefaultBlockSchema,
          editor
        )
      );
    }, [editor, props.items]);
  
    const shouldShow: boolean = useMemo(
      () => filteredItems.find((item) => item.type === block.type) !== undefined,
      [block.type, filteredItems]
    );
  
    const fullItems: ToolbarSelectItemProps[] = useMemo(() => {
      const onClick = (item: BlockTypeSelectItem) => {
        editor.focus();
  
        for (const block of selectedBlocks) {
          editor.updateBlock(block, {
            type: item.type as any,
            props: item.props as any,
          });
        }
      };
  
      return filteredItems.map((item) => ({
        text: item.name,
        icon: item.icon,
        onClick: () => onClick(item),
        isSelected: item.isSelected(block),
      }));
    }, [block, filteredItems, editor, selectedBlocks]);
  
    useEditorContentOrSelectionChange(() => {
      setBlock(editor.getTextCursorPosition().block);
    }, editor);
  
    if (!shouldShow) {
      return null;
    }
  
    return <ToolbarSelect items={fullItems} />;
  };
  