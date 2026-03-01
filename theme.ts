import { Button, createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "sm",
  components: {
    Button: Button.extend({
      defaultProps: {
        loaderProps: { size: "sm" },
      },
    }),
  },
});
