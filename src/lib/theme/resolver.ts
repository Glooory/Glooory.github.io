import { CSSVariablesResolver, MantineTheme } from "@mantine/core";
import { PrimerTokens } from "./colors";

export const resolver: CSSVariablesResolver = (_theme: MantineTheme) => ({
  variables: {
    "--font-sans": '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    "--font-mono": 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  light: {
    "--bg-default": PrimerTokens.light.bg.default,
    "--bg-subtle": PrimerTokens.light.bg.subtle,
    "--bg-inset": PrimerTokens.light.bg.inset,
    "--fg-default": PrimerTokens.light.fg.default,
    "--fg-muted": PrimerTokens.light.fg.muted,
    "--fg-subtle": PrimerTokens.light.fg.subtle,
    "--border-default": PrimerTokens.light.border.default,
    "--border-muted": PrimerTokens.light.border.muted,
    "--border-subtle": PrimerTokens.light.border.subtle,
    "--accent-fg": PrimerTokens.light.accent.fg,
    "--accent-emphasis": PrimerTokens.light.accent.emphasis,
    "--neutral-emphasis": PrimerTokens.light.neutral.emphasis,
    "--code-bg": PrimerTokens.light.code.bg,
    "--code-text": PrimerTokens.light.code.text,
    "--success-fg": PrimerTokens.light.success.fg,
    "--error-fg": PrimerTokens.light.error.fg,

    "--mantine-color-body": PrimerTokens.light.bg.default,
    "--mantine-color-text": PrimerTokens.light.fg.default,
  },
  dark: {
    "--bg-default": PrimerTokens.darkDimmed.bg.default,
    "--bg-subtle": PrimerTokens.darkDimmed.bg.subtle,
    "--bg-inset": PrimerTokens.darkDimmed.bg.inset,
    "--fg-default": PrimerTokens.darkDimmed.fg.default,
    "--fg-muted": PrimerTokens.darkDimmed.fg.muted,
    "--fg-subtle": PrimerTokens.darkDimmed.fg.subtle,
    "--border-default": PrimerTokens.darkDimmed.border.default,
    "--border-muted": PrimerTokens.darkDimmed.border.muted,
    "--border-subtle": PrimerTokens.darkDimmed.border.subtle,
    "--accent-fg": PrimerTokens.darkDimmed.accent.fg,
    "--accent-emphasis": PrimerTokens.darkDimmed.accent.emphasis,
    "--neutral-emphasis": PrimerTokens.darkDimmed.neutral.emphasis,
    "--code-bg": PrimerTokens.darkDimmed.code.bg,
    "--code-text": PrimerTokens.darkDimmed.code.text,
    "--success-fg": PrimerTokens.darkDimmed.success.fg,
    "--error-fg": PrimerTokens.darkDimmed.error.fg,

    "--mantine-color-body": PrimerTokens.darkDimmed.bg.default,
    "--mantine-color-text": PrimerTokens.darkDimmed.fg.default,
  },
});
