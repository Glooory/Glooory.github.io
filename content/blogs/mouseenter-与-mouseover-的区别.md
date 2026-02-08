---
title: mouseenter 与 mouseover 的区别
publishedAt: 2020-10-12 09:12:29
tags:
categories:
  - 前端技术
---

有些时候我们需要用 JavaScript 代码来监听鼠标进入或离开了画面上的某个元素，那与之相关的事件有下面四种（注意并没有 mousein 事件）：

- mouseover
- mouseout
- mouseenter
- mouseleave

也即两对事件：

- mouseover、mouseout
- mouseenter、mouseleave

这两对事件的主要区别如下：

|            | mouseover、mouseout                                                       | mouseenter、mouseleave                                                    |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 是否冒泡   | 是                                                                        | 否                                                                        |
| 可取消     | 是                                                                        | 否                                                                        |
| 接口       | [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) | [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) |
| 监听事件名 | onmouseover、onmouseout                                                   | onmouseenter、onmouseleave                                                |

从上表可以知道，这两对事件对开发者来说最重要的区别就在于它们是否冒泡，因为其实日常开发中最常见的使用场景就是只需要知道某个元素的鼠标进入和离开事件，对其子元素上的鼠标进入、离开我们其实很少去关心，所以如果此时使用事件会冒泡的 mouseover 和 mouseout 事件监听的话，是不太符合我们的要求的，应该使用 mouseenter 和 mouseleave 事件监听，即用 JavaScript 代码来达到 CSS 里面的 hover 事件。下图展示了一次典型的鼠标滑动进入以及离开某个元素时该元素及其子元素会发射的鼠标事件类型及顺序：

![](https://raw.githubusercontent.com/Glooory/images/master/blog/mouseover_mouseenter.png)

从上图控制台里打印的信息我们可以知道，父元素及其子元素上的鼠标事件发射顺序，即

1. 父元素的 mouseenter -> mouseover -> mouseout
2. 子元素的 mouseenter -> mouseover
3. 父元素的 mouseover (来自子元素的 mouseover 事件冒泡)
4. 子元素的 mouseout
5. 父元素的 mouseout (来自子元素的 mouseout 事件冒泡)
6. 子元素的 mouseleave
7. 父元素的 mouseover -> mousetout -> mouseleave

现在我们来分析一下上面的父子元素嵌套时的事件发射顺序，我们先把子元素上的事件暂时放一放，来单独看一下父元素上的事件及其顺序：

> mouseenter -> mouseover -> mouseout -> mouseleave

可以看到，mouseenter、mouseleave 跟 mouseover、mouseout 这两对四种事件的发射顺序是跟洋葱圈模型类似的，mouseenter、mouseleave 这对事件在外层，而 mouserover、mouseout 这组事件在里层，前面我们提到过，mouseover、mouseout 这对事件是会冒泡的，所以加上冒泡事件后他们的顺序变成了这样：

> mouseenter -> mouseover -> mouseover 冒泡 -> mouseout -> mouseout 冒泡 -> mouseleave

所有元素上鼠标的进入和离开事件都遵循上面的规则。如果元素有子元素时，在鼠标从父元素移动到子元素的过程中，父元素的 mouseout 会先触发，之后才是子元素的 mouseenter、mouseover、mouseover 冒泡。鼠标从子元素移动到父元素的过程则是子元素的事件先发射(mouseout、mouseout 冒泡、mouseleave)，然后才是父元素的 mouseover 事件，理清楚这些后再回过头去看上面的父子元素嵌套的时间顺序是不是更清晰明了了呢。
