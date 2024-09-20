---
title: Mantine 库导致 Vitest toBeEmptyDOMElement 断言失败
date: 2024-09-20 10:00:04
tags:
  - Vitest
categories:
  - 前端技术
---
<br />

对于那些根据条件渲染的 React 组件：

```typescript
export default function PublishedTag({ isPublished }: { isPublished?: boolean }) {
  if (!isPublished) {
    return null;
  }

  return <span>Published</span>;
}
```

针对组件有时候不会返回任何渲染结果的情况，我是这么写测试用例的：

```typescript
describe("PublishedTag", () => {
  it("should render nothing when the isPublished prop is falsy", () => {
    const { container } = render(<PublishedTag />)

    expect(container).toBeEmptyDOMElement();
  });
});
```

然后在项目里发现上面的 toBeEmptyDOMElement 断言失败了：
```javascript
should render nothing when the isPublished prop is falsy
Error: expect(element).toBeEmptyDOMElement()

Received:
  "<style data-mantine-styles="classes">@media (max-width: 35.99375em) {.mantine-visible-from-xs {display: none !important;}}@media (min-width: 36em) {.mantine-hidden-from-xs {display: none !important;}}@media (max-width: 47.99375em) {.mantine-visible-from-sm {display: none !important;}}@media (min-width: 48em) {.mantine-hidden-from-sm {display: none !important;}}@media (max-width: 61.99375em) {.mantine-visible-from-md {display: none !important;}}@media (min-width: 62em) {.mantine-hidden-from-md {display: none !important;}}@media (max-width: 74.99375em) {.mantine-visible-from-lg {display: none !important;}}@media (min-width: 75em) {.mantine-hidden-from-lg {display: none !important;}}@media (max-width: 87.99375em) {.mantine-visible-from-xl {display: none !important;}}@media (min-width: 88em) {.mantine-hidden-from-xl {display: none !important;}}</style>"Error: expect(element).toBeEmptyDOMElement()
```


看报错信息并调查发现项目使用了 [Mantine](https://mantine.dev/) 组件库，这个组件库必须要在根组件位置渲染 [MantineProvider](https://mantine.dev/theming/mantine-provider/) 才能正常工作:

```typescript
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({ ... });

export default function App({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
```

同样，为了测试组件，测试代码也需要在 render 的时候加上一个 wrapper 来渲染这个 MantineProvider, 不然会抛错，于是就定义了一个自定义的 render 方法：
```typescript
import { MantineProvider } from "@mantine/core";
import { RenderOptions, RenderResult, render as reactTestingLibRender } from "@testing-library/react";
import { ReactElement } from "react";

export function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">): RenderResult {
  return reactTestingLibRender(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => <MantineProvider theme={{}}>{children}</MantineProvider>,
    ...options,
  });
}
```

最开始断言失败的问题的原因就是因为渲染了 MantineProvider 导致的，MantineProvider 的渲染结果不是空的，它会返回一个 style 标签：
```html
<style data-mantine-styles="classes">@media (max-width: 35.99375em) {.mantine-visible-from-xs {display: none !important;}}@media (min-width: 36em) {.mantine-hidden-from-xs {display: none !important;}}@media (max-width: 47.99375em) {.mantine-visible-from-sm {display: none !important;}}@media (min-width: 48em) {.mantine-hidden-from-sm {display: none !important;}}@media (max-width: 61.99375em) {.mantine-visible-from-md {display: none !important;}}@media (min-width: 62em) {.mantine-hidden-from-md {display: none !important;}}@media (max-width: 74.99375em) {.mantine-visible-from-lg {display: none !important;}}@media (min-width: 75em) {.mantine-hidden-from-lg {display: none !important;}}@media (max-width: 87.99375em) {.mantine-visible-from-xl {display: none !important;}}@media (min-width: 88em) {.mantine-hidden-from-xl {display: none !important;}}</style>
```

所以即使前述 PublishedTag 组件有时候没有任何渲染结果，由于 MantineProvider 返回的 style 标签的存在，就会导致 toBeEmptyDOMElement 断言的失败。知道原因之后去翻了翻 MantineProvider 的[源码](https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/core/MantineProvider/MantineProvider.tsx)，发现它里面的 MantineCssVariables 和 MantineClasses 组件会有可能返回 style 标签：
```typescript
export function MantineProvider({
  ...
  withGlobalClasses = true,
  withCssVariables = true,
  ...
}: MantineProviderProps) {

  ...

  return (
    <MantineContext.Provider
      value={{ ... }}
    >
      <MantineThemeProvider theme={theme}>
        {withCssVariables && (
          <MantineCssVariables
            cssVariablesSelector={cssVariablesSelector}
            deduplicateCssVariables={deduplicateCssVariables}
          />
        )}
        {withGlobalClasses && <MantineClasses />}
        {children}
      </MantineThemeProvider>
    </MantineContext.Provider>
  );
}
```

MantineCssVariables 和 MantineClasses 这两个组件可以通过 withGlobalClasses、withCssVariables 这两个 props 控制到底渲不渲染，于是解决办法也找到了，在测试代码里渲染 MantineProvider 时将这两个值设为 false 即可：
```typescript
import { MantineProvider } from "@mantine/core";
import { RenderOptions, RenderResult, render as reactTestingLibRender } from "@testing-library/react";
import { ReactElement } from "react";

export function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">): RenderResult {
  return reactTestingLibRender(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider withCssVariables={false} withGlobalClasses={false} theme={{}}>
        {children}
      </MantineProvider>
    ),
    ...options,
  });
}
```

这样又可以愉快地使用 toBeEmptyDOMElement 断言啦。
