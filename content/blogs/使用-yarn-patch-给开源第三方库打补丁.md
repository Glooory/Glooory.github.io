---
title: 使用 yarn patch 给开源第三方库打补丁
publishedAt: 2024-03-20 16:40:37
updated: 2024-03-21 09:52:13
tags:
  - Yarn
categories:
  - 前端技术
---

<br />

有时候我们会遇到使用的开源第三方库有问题或者不能满足需求的情况，这时通常会有几种解决方案：

- 提交 PR 等着第三方库作者合并，这种方式往往会比较耗时间
- fork 该仓库然后修改提交，使用 fork 的仓库作为依赖
- 使用 `yarn patch` 打补丁，需要 [Yarn 2.0](https://yarnpkg.com/blog/release/2.0#new-protocol-patch) 及以上

对于一些比较紧急、简单的修改，或者在等待 PR 被合并的时候，先用第三种方式打个补丁用起来也许是一个不错的选择。那么如何使用 `yarn patch` 来打补丁呢？

假设我们已经找到了第三方库源码的问题，也找到了解决方案，这时我们需要先执行命令 `yarn patch <package>`：

```shell
// 这里以 `lodash-es` 为例
yarn patch lodash-es
```

上面命令的输出结果大致如下：

```shell
$ yarn patch lodash-es
➤ YN0000: Package lodash-es@npm:4.17.21 got extracted with success!
➤ YN0000: You can now edit the following folder: /private/var/folders/rn/9r11q7hn1t11d9zg/T/xfs-ffbebe5e/user
➤ YN0000: Once you are done run yarn patch-commit -s /private/var/folders/rn/9r11q7hn1t11d9zg/T/xfs-ffbebe5e/user and Yarn will store a patchfile based on your changes.
➤ YN0000: Done in 0s 85ms
```

根据上面的输出结果，我们就知道接下来要怎么做了。此时 yarn 已经将该三方库的代码提取出来放在了一个临时的文件夹下（参见第三行，按住 `CMD` 键鼠标单击该目录就可以在 VS Code 的新窗口中打开该文件夹了），我们按需修改该临时文件夹的三方库源码即可，修改完成之后按照上面的提示（参见第四行）执行 `yarn patch-commit -s <path>` 即可。执行该命令之后，yarn 会将我们对第三方库的修改以补丁文件的形式保存在 `.yarn/patches` 目录下，并且同时在 `package.json` 文件里面的 `resolutions` 属性里面加上一条记录，类似这样的：

```json
// package.json
{
  ...
  "packageManager": "yarn@4.0.2",
  "dependencies": {
    "lodash-es": "^4.17.21"
  }
  "resolutions": {
    "lodash-es@npm^4.17.21": "patch:lodash-es@npm%3A4.17.21#~/.yarn/patches/lodash-es-npm-4.17.21-b45832dfce.patch"
  }
}
```

然后我们只需要提交改动（`.yarn/patches` 目录下面的文件也需要提交）到 git 就完成对第三方库的打补丁了。

按理说，事情到这里就应该结束了，但是，我实际执行 `yarn patch-commit -s <path>` 的结果跟上面的却有差别，yarn 的[官网文档](https://yarnpkg.com/cli/patch-commit)上是这样说的：

> With the -s,--save option set, the patchfile won't be printed on stdout anymore and will instead be stored within a local file (by default kept within .yarn/patches, but configurable via the patchFolder setting). A resolutions entry will also be added to your top-level manifest, referencing the patched package via the patch: protocol.

看文档应该是会在 package.json 里面的 `resolutions` 里面加条记录，但是我实际的操作结果却是直接修改了 `dependencies` 里面对应的记录，而不是在 `resolutions` 里面加一条新的记录：

```json
// package.json
{
  ...
  "packageManager": "yarn@4.1.1",
  "dependencies": {
    "lodash-es": "patch:lodash-es@npm%3A4.17.21#~/.yarn/patches/lodash-es-npm-4.17.21-b45832dfce.patch"
  }
}
```

我暂时也不知道为什么，搜了一圈也无果，但是却能正常工作 😂。

<hr />

20240321 更新

我知道为什么上面我的结果是修改的 `dependencies` 而不是 `resolutions` 了，因为之前都是看别人说会在 `resolutions` 里面增加一条记录，我就以为一定会在 `resolutions` 里面加一条记录，然而我又仔细看了下 yarn [官网](https://yarnpkg.com/blog/release/2.0#new-protocol-patch)，发现其实人家是这么说的：

> **New Protocol: `patch:`**  
> Yarn 2 features a new protocol called `patch:`. This protocol can be used whenever you need to apply changes to a specific package in your dependency tree. Its format is similar to the following:
>
> ```
> {
>   "dependencies": {
>     "left-pad": "patch:left-pad@1.3.0#./my-patch.patch"
>   }
> }
> ```
>
> Together with the [resolutions](https://next.yarnpkg.com/configuration/manifest#resolutions) field, you can even patch a package located deep within your dependency tree. And since the `patch:` protocol is just another data source, it benefits from the same mechanisms as all other protocols - including caching and checksums!

原来当我们是给间接依赖的第三方库打补丁时，`resolutions` 字段才会派上用场，对直接依赖的第三方库打补丁时应该就是将 `dependencies` 里面的字段值修改为使用 `patch：` 协议的形式。下面继续来实验一下。

先安装一下 `axios`，可以看到 `axios` 依赖了 `form-data` 等几个第三方库：

```shell
$ yarn info axios
└─ axios@npm:1.6.8
    ├─ Version: 1.6.8
    │ (\n)?
    │ (\n)?
    └─ Dependencies
      ├─ form-data@npm:^4.0.0 → npm:4.0.0
      ├─ proxy-from-env@npm:^1.1.0 → npm:1.1.0
      └─ follow-redirects@npm:^1.15.6 → npm:1.15.6 [85cf1]
```

我们按照前面的方法试验一下给 `form-data` 打个补丁（`yarn patch form-data`），随意修改一下提取出来的源代码，然后提交补丁，可以看到这时确实是在 `resolutions` 里面增加了一条记录，之前的疑惑也终于得到了解释：

```shell
// package.json
{
  ...
  "packageManager": "yarn@4.1.1",
  "dependencies": {
    "axios": "^1.6.8",
  },
  "resolutions": {
    "form-data@npm:^4.0.0": "patch:form-data@npm%3A4.0.0#~/.yarn/patches/form-data-npm-4.0.0-916facec2d.patch"
  }
}
```
