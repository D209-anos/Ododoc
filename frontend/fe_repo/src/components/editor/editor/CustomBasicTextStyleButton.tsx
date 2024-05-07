import React from 'react';
import { Tooltip } from '@mantine/core';
import { BasicTextStyleButton } from '@blocknote/react';

interface CustomBasicTextStyleButtonProps {
  basicTextStyle: "bold" | "italic" | "underline" | "strike" | "code";
  tooltip: string;
}

export const CustomBasicTextStyleButton: React.FC<CustomBasicTextStyleButtonProps> = ({ tooltip, basicTextStyle }) => {
  return (
    <Tooltip label={tooltip} withArrow>
      <div>
        <BasicTextStyleButton basicTextStyle={basicTextStyle} />
      </div>
    </Tooltip>
  );
};
