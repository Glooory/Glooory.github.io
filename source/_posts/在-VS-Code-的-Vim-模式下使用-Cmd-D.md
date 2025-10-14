---
title: 在 VS Code 的 Vim 模式下使用 Cmd + D
date: 2025-10-13 15:51:28
tags:
  - Vim
categories:
  - 经验杂谈
---

今天早上看一个视频时发现作者在 VS Code 里面使用 `Cmd + D` 快速选择了多处相同的内容，然后想起自己以前也经常用这个快捷键，但是自从使用 Vim 插件之后就忘记了，
马上打开 VS Code 试了下原来不行，估计当初也是发现不行没解决久而久之就忘记了。打开快捷键配置发现是正确配置的，那应该是和其他程序的快捷键冲突导致的，
排查了很久发现是自己使用的词典软件绑定了这个快捷键到加入生词本上，去掉之后发现 `Cmd + D` 能在 VS Code 里面用了。

> 如果没有快捷键冲突时发现 `Cmd + D` 还是无法工作的话可能是因为 [Vim 和 VS Code 这两的快捷键冲突](https://github.com/VSCodeVim/Vim/issues/2144)了,
此时需要配置一下 Vim 让其不要响应 `Cmd + D` 而是让 VS Code 来处理：

```json
{
  "vim.handleKeys": {
    "<C-d>": false
  },
}
```

但是，又发现使用 `Cmd + D` 多选之后按 `i` 无法在多个光标处同时进入插入模式，这个问题倒是有几个[曲线救国的方法](https://github.com/VSCodeVim/Vim/issues/2144#issuecomment-1320492742)：
1. 使用 `Cmd + D` 后再使用 `Shift + a` 代替 `i` 进入插入模式
2. 使用 `Cmd + D` 后再使用 `v` 进入 Visual 模式之后再用 `i` 进入插入模式


