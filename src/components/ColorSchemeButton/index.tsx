"use client";

import { useEffect, useState } from "react";
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

  const [rendered, setRendered] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => setRendered(true), []);

  if (!rendered) {
    return null;
  }

  return (
    <Button variant="transparent" className={clsx(styles.button, classNames?.button)} onClick={toggleColorScheme}>
      {colorScheme === "light" ? <IconSun size={24} {...iconProps} /> : <IconMoon size={24} {...iconProps} />}
    </Button>
  );
};

export default ColorSchemeButton;
