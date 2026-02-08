---
title: Safari 上 scroll smooth 无效的解决方案
publishedAt: 2020-10-14 09:03:48
tags:
categories:
  - 前端技术
---

一般在垂直方向上显示内容很多的网页里，右下角通常会有一个滚动到顶部的按钮，用户点击之后就回到网页的最顶部，这个按钮的实现可以采用 window 或者 element 的 scroll 或者 scrollTo 方法，scroll 和 scrollTo 这两个方法是一样的，没有区别，它们的签名如下：

```javascript
element.scrollTo(x, y); // x, y 分别指要滚动到的 X、Y 轴的坐标

/** top，left 分别指要滚动到的 X、Y 轴的坐标, behavior 指滚动的行为方式，可以指定为平滑滚动  */
element.scrollTo({ top?: numner, left?: number, behavior?: 'auto' | 'smooth' });

```

通常我们希望的是网页能很自然平滑的滚动到顶部，如果是直接很生硬地跳到顶部的话，用户体验上会打折扣，所以我们立即能想到的解决方案就是把 behavior 设置为 smooth，但可惜的是在 [Safari 浏览器上并不支持 smooth behavior](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior) :

![](https://raw.githubusercontent.com/Glooory/images/master/blog/smooth_compatibility.png)

<figure>
  <img src="https://raw.githubusercontent.com/Glooory/images/master/blog/scroll_smooth_behavior.gif" alt="scroll_smooth_behavior"/>
  <figcaption>设置了 smooth behavior 在 Chrome(左)和 Safari(右)上的运行效果</figcaption>
</figure>

为了解决 Safari 上的兼容性问题，我们只好做特殊适配或者换另一种实现思路。平滑滚动的效果可以近似看作为就是在一定时间内网页慢慢滚动到某个位置，而不是直接跳到某个位置，既然是这样我们用代码把网页或者元素缓慢滚动到某个位置不就能模拟出平滑滚动的效果了吗？我们可以使用 window 或者 element 的 scrollBy 方法来让其滚动，scrollBy 和 scrollTo 方法类似，不同的是 scrollBy 接收两个参数时，这两个参数是指 X 和 Y 轴方向滚动的距离(单位为像素)，scrollTo 接收两个参数时，这两个参数是指 X 和 Y 轴上的坐标。我们现在使用 scrollBy 实现一下看看效果：

```javascript
const scrollToTopSmoothly = (scroller, duration = 300) => {
  let yOffset = scroller.scrollTop;
  if (yOffset <= 0) return;
  const intervalDuration = 30;
  const loopTimes = Math.ceil(duration / intervalDuration);
  const stepY = Math.ceil(yOffset / loopTimes);
  const scrollByStep = () => {
    scroller.scrollBy(0, -stepY);
    yOffset -= stepY;
    if (yOffset > 0) {
      window.requestAnimationFrame(scrollByStep);
    }
  };
  window.requestAnimationFrame(scrollByStep);
};
```

<figure>
  <img src="https://raw.githubusercontent.com/Glooory/images/master/blog/scroll_smoothly_workround.gif" alt="scroll_smoothly_workround"/>
  <figcaption>实际的运行效果(左 Chrome，右 Safari)</figcaption>
</figure>

可以看到使用 scrollBy 可以大致模拟出平滑滚动的效果，基本解决了 Safari 上滚动生硬的问题。
