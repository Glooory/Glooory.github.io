---
title: React Hooks
publishedAt: 2019-12-13 14:45:49
tags:
  - React
categories:
  - 前端技术
---

### React Hooks 简介

2019 年 2 月 Facebook 发布了 React v16.8.0，这次更新最让人兴(头)奋(秃)的就属 Hooks 莫属了。细心的你可能通过本次更新的版本号就能知道 Hooks 并没有带来破坏性的改动，它向下兼容，并且它完全是可选的，你可以选择不使用 Hooks 而不影响你继续使用 React。

那么 Hooks 到底是什么东西呢？  
顾名思义，Hooks 是一些可以让你在函数组件中“钩入” React state 及生命周期等特性的函数，也就是说以前只能在 class 组件中才能使用的 React 特性，现在也可以在函数组件中使用了。在发布 Hooks 之前，如果想在组件内部维护一些状态，或者需要在某些特定时刻执行特定操作，那么不好意思，你只能写一个 class 组件来实现，但是现在你有了另一种选择，那就是 Hooks。  
<br />

### Hooks 的由来

Hooks 发展出来的原因主要有下面几个：

- 组件间复用状态逻辑很难  
  即使可以使用 render props 和高阶组件(HOC)来解决代码复用的问题，但这些方式并不完美，它们需要你重新组织你的代码结构，可能让你的代码更难理解，很容易形成组件嵌套地域。

- 复杂组件变得难以理解  
  复杂组件的每个生命周期函数里通常包含很多的逻辑，并且可能相关联的逻辑代码被拆分到了不同的生命周期函数里，比如在组件挂载之后设置监听事件，在组件销毁之前取消监听，但是这两件事本属于同一事件的处理，却不得不被拆分在了不同的函数之中，更容易导致 bug。

- 增加学习成本的 class 和 this  
  React 离不开 class，再加上 JavaScript 中让人捉摸不透的 this 增加了 React 的学习成本

那 Hooks 又是怎样规避这些问题的呢？

- Hooks 本质就是 JavaScript 函数，多个函数之间怎么共享逻辑呢？提取共通的逻辑作为新的函数就可以了，所以 Hooks 可以很方便的复用状态逻辑
- Hooks 可以将组件中不相关的逻辑部分拆分为独立、更小的函数(比如请求数据、设置事件监听)，而并非强制按照生命周期来划分
- Hooks 让你在函数组件中也可以使用 React 的特性，可以避开难以理解的 class 和 this  
  <br />

### 常用的一些 Hooks

#### useState

React 内置的 Hook，可以使用它来为函数组件保存状态。  
useState 用来声明一个 state，它接受一个初始值作为该 state 的初始值并返回一个数组，也可向 useState 传入一个函数，该函数的返回值会作为该 state 的初始值，当初始值需要大量计算后才能得到时就可以传入一个函数来初始化 state。useState Hook 的返回结果数组第一项是这个 state 的最新值，第二项是用来更新该 state 的函数，这个更新函数跟 class 组件里面的 setState 函数类似，调用它们都会触发组件重新渲染，但是 setState 函数是会合并它执行时的 state 和接收到的 state 参数的，而更新函数并不会像 setState 那样合并 state，它只是单纯赋值更新。我们可以通过数组解构的方式来很方便的命名和使用 useState 的返回结果。

```javascript
import React, { useState } from "react";

function Counter() {
  // 使用 useState 声明一个叫 count 的 state 变量，通过数组解构的方式拿到最新的 state 和更新函数
  // React 保证在每次渲染期间拿到的 count 都是最新的值，并且更新函数的引用不会在组件重新渲染时发生变化
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 调用更新函数更新当前 count 的状态，会触发组件重新渲染
    setCount(count + 1);

    // 更新函数也支持函数作为参数，该函数的第一个参数为该 state 的最新值
    // setCount(count => count + 1); //
  };

  return (
    <div>
      <p>You clicked {count} time(s)</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

<br />

#### useEffect

React 内置的 Hook，使用它来进行一些可以包含副作用（网络请求、操作 DOM等）的操作。  
useEffect 接收一个可以包含副作用的函数（下文统称为 effect）作为参数，effect 默认会在组件每次渲染之后执行，后面会说明怎么让 effect 只在特定条件下执行。
传递给 useEffect 的 effect 可以返回一个用来清理该 effect 的函数，比如清除定时器、解绑事件、取消订阅等等，如果该 effect 不需要清理，比如是发送一个网络请求的 effect，则可不返回值。useEffect hook 可以理解为 componentDidMount、componentDidUpdate、componentWillUnmout 三个生命周期函数的合体。

```javascript
import React, { useEffect, useState } from "react";

function App() {
  // 使用 useState Hook 声明一个叫 windowSize 的 state
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleWindowResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // 使用 useEffect Hook 执行一些可包含副作用的命令操作
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    // effect 可返回一个函数用来清理该 effect，如果该 effect 不需要清理则可不返回值
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []); // useEffect Hook 的第二个参数用来指定该 effect 的依赖，稍后会解释它的作用

  const { width, height } = windowSize;
  return (
    <div>
      <p>Window widht: {width}</p>
      <p>Window height: {height}</p>
    </div>
  );
}
```

默认情况下，组件每次渲染后都会调用传给 useEffect 的 effect，但是我们可以通个传递给 useEffect 函数的第二个参数来控制 effect 执行的时机，useEffect 的第二个参数接受一个数组，只要该数组里面的某个变量在某次渲染前后发生变化时，effect 就会被执行。当第二个参数为空数组时，则这个 effect 只会在组件第一次渲染的时候执行，清除 effect 的函数也只会在组件卸载前执行(如果有的话)，所以，当传入 useEffect 的第二个参数为空数组时 useEffect 就跟 componentDidMount 和 componentWillUnmount 作用一致，如果第二个参数数组里指定了这个 effect 的依赖时，那此时 useEffect 就相当于 componentDidUpdate 生命周期函数。

```javascript
import React, { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count;
  }, [count]); // 只有 count 值在某次渲染前后发生改变时，该 effect 才会被执行

  return (
    <div>
      <p>You clicked {count} time(s)</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

<br />

#### 自定义 Hook

由于 Hook 本质就是函数，所有我们可以很方便地把共通的逻辑处理像提取共通函数一样提取出来作为自定 Hook，比如上面获取 window size 的例子就可以提取出来作为一个可复用的自定义 Hook，自定义 Hook 的命名需要遵循 useXXX 的规范。

```javascript
import React, { useEffect, useState } from "react";

// 抽取共通的逻辑状态处理代码作为自定义 Hook，命名需以 use 开头
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleWindowResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return windowSize;
}

function App() {
  // 使用自定义 Hook，跟其他内置 Hook 一样
  const { width, height } = useWindowSize();
  return (
    <div>
      <p>Window widht: {width}</p>
      <p>Window height: {height}</p>
    </div>
  );
}
```

<br />

### Hooks 的使用规则

为了让 Hooks 能按照期望正常工作，在使用 Hooks 的时候需要遵循两条原则：

- 只在 React 函数中调用 Hook  
  不要在普通的 JavaScript 函数中调用 Hook，你可以
  - 在 React 函数组件中调用 Hook
  - 在自定义 Hook 中调用其他 Hook

- 只在最顶层使用 Hook  
  不要在循环、条件或嵌套函数中调用 Hook，保证在 React 函数的最顶层调用他们

```javascript
import React, { useEffect, useState } from "react";

function Header() {
  const [username, setUsername] = useState(""); // 正确, 在 React 函数最顶层调用 Hook

  if (condition) {
    useEffect(() => {}); // 错误，不要在循环、条件或嵌套函数中调用 Hook
  }
}

function useCustomHook() {
  const [variable, setVariable] = useState(""); // OK，在自定义函数中调用 Hook
  useEffect(() => {});
}
```

<br />

### 开始使用 Hooks 吧

基本只要掌握了 useState 和 useEffect 两种 Hooks 之后，你就可以尝试在日常开发中使用 Hooks 来代替 class 进行 React 项目的开发和维护了，但这两个 Hooks 并不能覆盖到我们所有的开发场景，由于局限于文章篇幅和作者水平这里就不再展开其他的 Hooks 了，更多的请参阅 [Hooks 官方文档](https://zh-hans.reactjs.org/docs/hooks-reference.html)。下面我们来对比看一下使用 Hooks 和 class 两种不同方式来实现同一组件的不同之处。

#### 使用 class 的实现

```javascript
class App extends React.Component {
  state = {
    filter: "",
    jobs: [],
  };

  componentDidMount() {
    const { filter } = this.state;
    JobAPI.getJobs(filter).then((res) => this.setState({ jobs: res }));
    UserAPI.subscribeNotification();
  }

  componentWillUnmount() {
    UserAPI.unsubscribeNotification();
  }

  handleFilterChange = (e) => this.setState({ filter: e.target.value.trim() });

  render() {
    const { filter, jobs } = this.state;
    return (
      <div>
        <div>
          <span>filter:</span>
          <input type="text" value={filter} onChange={(e) => this.handleFilterChange(e)} />
        </div>
        {jobs.map((job) => (
          <Job job={job} />
        ))}
      </div>
    );
  }
}
```

<br />

#### 使用 Hooks 的实现

```javascript
import React, { useEffect, useState } from "react";

function App() {
  const [filter, setFilter] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    JobAPI.getJobs(filter).then((res) => setJobs(res));
  }, [filter]);

  useEffect(() => {
    UserAPI.subscribeNotification();

    return () => {
      UserAPI.unsubscribeNotification();
    };
  }, []);

  const handleFilterChange = (e) => setFilter(e.target.value.trim());

  return (
    <div>
      <div>
        <span>filter:</span>
        <input type="text" value={filter} onChange={(e) => handleFilterChange(e)} />
      </div>
      {jobs.map((job) => (
        <Job job={job} />
      ))}
    </div>
  );
}
```

通过对比我们可以发现使用 Hooks 时可以不再像写 class 一样需要写一些模板代码，也不用考虑逻辑代码应该放在哪个生命周期函数里，不用跟 this 打交道，可以更方便地实现状态逻辑的复用，而且截止目前为止，很多开源的第三方库都已经支持了 Hooks ，社区也有很多各种各样的自定义 Hooks，所以你还有什么理由不来试一下 Hooks 呢。  
React 官方也表态了，虽然暂时没有计划移除 class ，但是 Hooks 是 React 的未来发展方向，尽管目前 Hooks 还不能完全取代 class，少数情况下仍然需要 class，React 团队也在尽力解决这个问题，相信未来的一段时间 React 一定是属于 Hooks 的。
