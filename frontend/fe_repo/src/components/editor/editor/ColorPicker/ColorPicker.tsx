import { Menu } from "@mantine/core";
import { ColorIcon } from "./ColorIcon";
import { TiTick } from "react-icons/ti";

const colorNames = {
  default: "기본",
  gray: "회색",
  brown: "갈색",
  red: "빨간색",
  orange: "주황색",
  yellow: "노란색",
  green: "초록색",
  blue: "파란색",
  purple: "보라색",
  pink: "분홍색",
};

export const ColorPicker = (props: {
  onClick?: () => void;
  iconSize?: number;
  text?: {
    color: string;
    setColor: (color: string) => void;
  };
  background?: {
    color: string;
    setColor: (color: string) => void;
  };
}) => {
  const TextColorSection = () =>
    props.text ? (
      <>
        <Menu.Label>글자색</Menu.Label>
        {Object.entries(colorNames).map(([key, name]) => (
          <Menu.Item
            onClick={() => {
              props.onClick && props.onClick();
              props.text!.setColor(key);
            }}
            component={"div"}
            data-test={"text-color-" + key}
            leftSection={<ColorIcon textColor={key} size={props.iconSize} />}
            rightSection={
              props.text!.color === key ? (
                <TiTick size={20} className={"bn-tick-icon"} />
              ) : (
                <div className={"bn-tick-space"} />
              )
            }
            key={"text-color-" + key}>
            {name}
          </Menu.Item>
        ))}
      </>
    ) : null;

  const BackgroundColorSection = () =>
    props.background ? (
      <>
        <Menu.Label>배경색</Menu.Label>
        {Object.entries(colorNames).map(([key, name]) => (
          <Menu.Item
            onClick={() => {
              props.onClick && props.onClick();
              props.background!.setColor(key);
            }}
            component={"div"}
            data-test={"background-color-" + key}
            leftSection={<ColorIcon backgroundColor={key} size={props.iconSize} />}
            key={"background-color-" + key}
            rightSection={
              props.background!.color === key ? (
                <TiTick size={20} className={"bn-tick-icon"} />
              ) : (
                <div className={"bn-tick-space"} />
              )
            }>
            {name + " 배경"}
          </Menu.Item>
        ))}
      </>
    ) : null;

  return (
    <>
      <TextColorSection />
      <BackgroundColorSection />
    </>
  );
};
