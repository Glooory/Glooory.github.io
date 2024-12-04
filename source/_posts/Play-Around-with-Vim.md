---
title: Play Around with Vim
date: 2024-11-27 08:48:39
tags:
  - Vim
categories:
  - 经验杂谈
---

如果有个编辑器能让我们写代码时用键盘操作代替很多的鼠标操作，减少手在键盘、鼠标之间的移动切换，减少敲退格键的次数等影响效率的操作，但是它非常地难以上手，不知你是否愿意去试试它呢？

那 Vim 就是这样的编辑器之一，可能大家或多或少也听说过 Vim，听说过它的强大也听闻过它的学习上手难度，很多人都是没有熬过新手期就放弃了，包括我（还不止一次）。前年一位同事在次会议上介绍了下 Vim，再一次激起了我学习 Vim 的兴趣，从今年一月份我又一次开始尝试，庆幸地是这次终于算是熬过了新手期，到目前为止使用起来感觉还非常不错，不过目前也还是一只仍在不断摸索学习的菜鸟，可能有不妥、错误之处。

先说说我为什么想要使用 Vim，最开始当然是听别人推荐的，然后用下来发现它确实能大大提升编辑代码的效率，它能减少很多键盘鼠标之间来回的切换，而且能够减少很多次的按键。其实如果像我一样是在 IDE 里面安装插件使用 Vim 的话，上手 Vim 应该还是比较简单的，只要掌握了怎么移动光标（`h`、`j`、`k`、`l`）和进入、退出插入模式（`i`, `a`, `o` 等），应该就能开始慢慢上手 Vim 了， 常用的一些操作命令其实语义化很好，很容易记住。下面是一些我自己觉得 Vim 里面用起来非常舒服的命令操作（当然如果有更好的方式、技巧也可以分享给我下）：

- 以单词为单位移动光标
  - `w`：移动到下一个单词开头（可以记为for-**w**ord）
  - `b`：移动到上一个单词开头（可以记为（**b**ack-word）
  - `e`：移动到下一个单词结尾（可以记为 end）
  - `ge`：移动到上一个单词结尾（不知道怎么好记点，死记硬背吧）  

  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_move_by_word.mp4" width="100%" height="auto" controls></video>

- 跳转到当前行的下、上一个 {char}（{char} 代表任意字符，后同）处
  - `f{char}`、`F{char}`:  先按 `f` 键再按另一个想要查找字符键（可以记为 find {char}），光标就会移动到当前行光标右侧的 {char} 处，如果当前行光标右侧没有找到 {char}，那么光标则会保持不动，`F{char}` 跟 `f{char}` 一样，只是它是反向寻找（在当前行往光标左侧查找），如果一行里有很多个我们想要找的字符，也不用每次都重复 `f{char}` 命令，后续只需按 `;`（向后继续查找）, `,`（向前继续查找） 即可快速查找。
  - `t{char}`、`T{char}`: 可以记为 till {char}, 这两个操作跟 `f{char}`、`F{char}` 类似，它两配合 `c`、`d` 操作命令效果更佳。比如：
    - `dt"` 是删除直到 `"` 位置（可以记为 delete till "）
    - `ct(` 是删除直到 `(` 位置，并进入插入模式（可以记为 change till `(`）

  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_f_t.mp4" width="100%" height="auto" controls></video>

- 快速新建一行而**不用考虑光标是不是在的行首、行尾位置**
  - `o`：在光标所在行下方新建空白行
  - `O`：在光标所在行上方新建空白行
  
    <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_o_O.mp4" width="100%" height="auto" controls></video>

- 快速在特定位置开始插入内容而**不用考虑光标到底在不在特定的位置**
  - `I`：开始在行首进行插入（小写的 `i` 是在光标右侧处插入，大写的 `I` 则是不管光标在行的何处都是在行首位置处插入，这样就不用移动光标到行首再开始插入了）
  - `A`：开始在行尾进行插入（小写的 `a` 是在光标左侧处插入，大写的 `A` 则是不管光标在行的何处都是在行尾位置处插入，这样就不用移动光标到行尾再开始插入了）
  - `S`：清空当前行内容，然后开始插入

  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_I_A_S.mp4" width="100%" height="auto" controls></video>

- 快速删除、修改成对符号内的内容
  - `ciX`: 这个可以记为 change inner X, X 可以是成对出现的符号，如 `"`、`'`、`(`、`{` 等等，也可以是 `w`,`t`, 这个操作命令只要是光标在成对出现的符号内都可以起作用，`c` 操作命令也可以换成其他操作命令，比如 `d`、`y`、`gU`等，比如：
    - `ci(`：删除 `()` 内的内容并且进入插入模式
    - `di"`：删除 `""` 内的内容
    - `cit`：删除 xml 标签内的内容并且进入插入模式
    - `ciw`：删除光标所在位置的单词并进入插入模式，它和 `dw` 的区别在于，后者需要先将光标移到单词第一个字符处，而 `ciw` 则是光标在单词的任意字符处都可以删除整个单词
  - `caX`：如果要包含外围的成对出现的符号则可以把 `i` 换成 `a`，比如：
    - `ca"`：删除双引号及其内部的内容并进入插入模式（可以记为 change around xxx）
    - `daw`：删除整个单词而**不用考虑光标在不在单词第一个字母处，只要光标在单词任意处即可**
  
  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_ciX_caX.mp4" width="100%" height="auto" controls></video>

- 快速重复上一次操作
  - `.`: 重复上一次的操作，这个命令非常简单但是很强大，某些情况下你会发现 `.` 真的能帮上大忙
  - 还可以把重复的操作命令录制成宏，关于宏我自己使用经验不多就不说了

  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_period_operator.mp4" width="100%" height="auto" controls></video>

- 想跳哪儿跳哪儿
  - 使用 [`easy-motion`](https://github.com/easymotion/vim-easymotion) 这个 Vim 插件，能够让我们纯通过键盘就可以指哪儿打哪儿，它的工作方式跟 `f{char}` 类似，`f{char}` 的作用范围是当前行，而它的作用范围是整个文件，比如 `\\f<` 操作命令就是找到光标后面所有 `<` 字符的位置，每个 `<` 处都会被某个高亮字符标示出来，按对应的高亮字符就可以跳转到对应位置了，如果要向后查找整个文件内容，可以把 `f` 换成 `F`: `\\F<`
  
  <video src="https://raw.githubusercontent.com/Glooory/images/master/blog/vim_easy_motion.mp4" width="100%" height="auto" controls></video>


上面这些操作命令是我在使用 Vim 过程中感觉用起来非常舒服的操作命令，当然这些只是让 Vim 非常强大的操作命令里面的很小部分，但是光这些就足够让我继续坚持使用和学习 Vim 了（我这只井底之蛙让大家见笑了），我是在 IDE 里面装了个的 Vim 的插件使用 Vim 的，这样就可以将 Vim 的强大和 IDE 的方便结合在一起使用，也比较推荐先在自己习惯的 IDE 里面安装 Vim 的插件起步。

不知道这些我口中所谓的快速、高效操作命令有没有激起你也想去尝试一下的兴趣，不管有没有，只要你对 Vim 有一丁点印象也很好的了，后续什么时候你发现自己被重复按退格键、方向键等操作困扰想要想想有没有什么解决办法时，那时也许就是尝试 Vim 的好契机了，熬过新手期很难，多试试几次也没关系，一旦偶尔心血来潮想起来了就可以玩一玩试一试 Vim，说不定哪天就开始喜欢上 Vim 了。

最简便学习体验 Vim 的方式就是打开终端输入 `vimtutor` 进入官方的教程，想学时就打开复习学习下，每次学少数操作命令即可，不想学习关掉即可，毕竟 Vim 也只一种选择而已，Play Around with Vim，or Just Forget About It.