"use client";

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "../../../theme";
import { resolver } from "./resolver";

export default function CustomMantineProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={resolver} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  );
}
