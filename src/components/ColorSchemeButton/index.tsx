import { IconMoon, IconProps, IconSun } from "@tabler/icons-react";
import clsx from "clsx";
import { Button, useMantineColorScheme } from "@mantine/core";
import styles from "./styles.module.css";

export interface ColorSchemeButtonProps {
  classNames?: {
    button?: string;
  };
  iconProps?: IconProps;
}

const ColorSchemeButton = (props: ColorSchemeButtonProps) => {
  const { iconProps, classNames } = props;

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Button variant="transparent" className={clsx(styles.button, classNames?.button)} onClick={toggleColorScheme}>
      {colorScheme === "light" ? <IconSun size={24} {...iconProps} /> : <IconMoon size={24} {...iconProps} />}
    </Button>
  );
};

export default ColorSchemeButton;
