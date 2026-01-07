"use client";

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

  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <Button variant="transparent" className={clsx(styles.button, classNames?.button)} onClick={toggleColorScheme}>
      <IconSun size={24} className={styles["color-scheme-icon__sun"]} {...iconProps} />
      <IconMoon size={24} className={styles["color-scheme-icon__moon"]} {...iconProps} />
    </Button>
  );
};

export default ColorSchemeButton;
