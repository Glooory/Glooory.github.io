---
title: 使用 yarn patch 给开源第三方库打补丁
date: 2024-03-20 16:40:37
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

根据上面的输出结果，我们就知道接下来要怎么做了。此时 yarn 已经将该三方库的代码提取出来放在了一个临时的文件夹下（参见第三行），我们按需修改该临时文件夹的三方库源码即可，修改完成之后按照上面的提示（参见第四行）执行 `yarn patch-commit -s <path>` 即可。执行该命令之后，yarn 会将我们对第三方库的修改以补丁文件的形式保存在 `.yarn/patches` 目录下，并且同时在 `package.json` 文件里面的 `resolution` 属性里面加上一条记录，类似这样的：

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

看文档应该是会在 package.json 里面的 `resolution` 里面加条记录，但是我实际的操作结果却是直接修改了 `dependencies` 里面对应的记录，而不是在 `resolution` 里面加一条新的记录：

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