---
title: 如何更好地理解函数组件和 useEffect
publishedAt: 2022-09-14 18:02:15
tags:
  - React
categories:
  - 经验杂谈
---

距 2019 年 2 月 Hooks 发布已经过去 3 年多了，在过去的 3 年多里，函数组件慢慢替代 Class 组件成为了开发 React 组件的首选。既然函数组件已成主流，那么掌握好函数组件也是开发人员必备的一个技能。以何种心智模型去看待 Class 组件和函数组件可能影响着我们对他们的理解。我现在是这么看待它们俩的：

> Class 组件：响应生命周期。componentDidMount、componentDidUpdate等回调里应该做什么？
>
> 函数组件：响应、同步数据流变更。state、props 变了应该做什么？

从 Class 组件的响应生命周期的思维模型转换到函数组件的响应、同步数据流变更的思维模型有助于我们更容易理解函数组件，写起代码来也更加得心应手。

React 里面有个非常重要的概念就是单向数据流，单向数据流是串起整个组件树的血液，数据流决定着我们的应用长什么样，能做什么，而 React 做的工作就是把数据流里的数据同步到 UI 上，并响应用户的操作。

数据流包括组件内的 state、props、函数，没错，函数也是数据流的一部分。

### 每一次渲染都有对应的 state、props、函数

当数据流里的数据发生改变时，React 就会重新生成新的组件树，最后将最新数据流反应到 UI 上。每一次渲染 ，组件都会记得当次渲染数据流里面的 state 和 props。以下面组件为例说明：

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  }

  return (
    <div>
      <button onClick={handleClick}>Add</button>
      <span>{`You clicked ${count} times`}</span>
    </div>
  )
}

```

为了方便理解，我们可以想象每次数据流变化后就会生成一个快照，React 则根据这个快照渲染出对应的 UI。初次渲染时，当前快照里的 count 值为 0，handleClick 函数是一个新生成的函数，这次快照的渲染结果就是初次渲染出来的 UI，点击按钮 count 值变了之后，又会生成此刻数据流的快照，这次快照里面 count 值为 1， handleClick 又是一个新生成的函数，对应第二次渲染出来的 UI。

即每一次渲染都有属于这次渲染的 state、props、函数。

### 每次渲染都有对应的 effect 吗？effect 是什么时候执行的呢？

每次渲染的时候，函数组件都会被重新执行一次，那么函数组件里面的 effect 是什么时候被执行的呢？每次渲染的大致流程如下：

```
数据流发生变更啦
    ↓
根据最新的数据流生成新的组件树
    ↓
更新 UI、浏览器绘制
    ↓
执行 effects

```

我们可以把 effect 看成是某次渲染结果的一部分，effect 使你能够根据 props 和 state “同步”组件树之外的东西。

每次渲染都有属于这次渲染的 state、props、事件处理函数、effects 等一切。

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <button onClick={handleClick}>Add</button>
      <span>{`You clicked ${count} times`}</span>
    </div>
  )
}

```

### 需要每次渲染都调用 effects 吗？

当然不是，我们希望何时调用 effects 能受我们控制，而不是每次渲染都调用，所以你可以提供给 useEffect 一个依赖数组参数：

```typescript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 依赖数组
```

这就相当于告诉 React：“Hey，React，我只用到了数据流里面的 count， 别无其他”。当前后两次渲染时这些依赖项一样，这就相当于不需要同步，React 会跳过这次 effect，如果任意值在两次渲染时不一样，那么 React 就会执行这个 effect，去同步“状态”。是的，effect 的执行也可以理解为去同步状态，只是是组件树外的状态。

### 关于依赖项不要对 React 撒谎

effect 中用到的所有组件内的值都要包含在依赖中，也就是数据流里面的值，包括 props、state 以及函数，组件内的任何东西。

如果你对 React 撒谎则会导致一些问题，比如 effect 没有执行或者无限重复执行或者 effect 里面访问到的 state 和 props 是旧的值等等。

### 两种诚实告知依赖的策略

有两种诚实告知依赖的策略。应该记住第一种策略，任何时候都应该用它，然后在需要的时候应用第二种。

第一种策略是在依赖中包含所有 effect 中用到的数据流里面的值，一个都不能少。

第二种策略是修改 effect 内部的代码，移除一些依赖，让 effect 的依赖变得更少。

### 让 effect 自给自足

1. 如果 effect 里面只是基于原 state 计算新的 state，那么可以采用 setState 的函数形式。

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]);

// 使用 setState 的函数形式
useEffect(() => {
  const timer = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []); // 成功移除依赖
```

1. useReducer：使用 Action 来解耦

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + step);
    }, 1000);
    return () => clearInterval(timer);
  }, [step]); // 如何把这个依赖也移除掉？

  return (
    <>
      <h1>{count}</h1>
      <inputvalue={step}onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}

// 使用 useReducer 来移除依赖
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  function reducer(state, action) {
    const { count, step } = state;
    if (action.type === 'tick') {
      return { ...state, count: count + step };
    } else if (action.type === 'updateStep') {
      return { ...state, step: action.step }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 依赖被移除掉了

  return (
    <>
      <h1>{count}</h1>
      <inputvalue={step}onChange={e => dispatch({
        type: 'updateStep',
        step: Number(e.target.value))
      } />
    </>
  );
}

```

函数也应该纳入依赖项

```typescript
const SearchResult() {
  const fetchData = () => {
    // fetch data...
  }

  useEffect(() => {
    fetchData();
  }, []); // 这样通常没有什么问题

  return <xxx>...</xxx>
}

```

上面这样通常没有问题，但最好还是把函数移到 effect 里面去：

```typescript
const SearchResult() {

  useEffect(() => {
    const fetchData = () => {
      // fetch data...
    }
    fetchData();
  }, []);

  return <xxx>...</xxx>
}

```

可是我不能把函数移动到 effect 里...

```typescript
function SearchResults() {
  // 每次渲染都会新生成一个新的函数
  function getFetchUrl(query) {
    return "/api/v1/search?query=" + query;
  }

  useEffect(() => {
    const url = getFetchUrl("react");
    // ... 获取数据或者做点什么 ...
  }, [getFetchUrl]); // 依赖是正确的，但是依赖项变更太频繁了

  useEffect(() => {
    const url = getFetchUrl("redux");
    // ... 获取数据或者做点什么 ...
  }, [getFetchUrl]); // 依赖是正确的，但是依赖项是变更太频繁了

  // ...
}
```

那怎么办？用 useCallback，或者把函数提到组件外面去。

```typescript
function SearchResults() {
  const getFetchUrl = useCallback((query) {
    return '/api/v1/search?query=' + query;
  }, [query]);

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据或者做点什么 ...
    }, [getFetchUrl]);

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据或者做点什么 ...
  }, [getFetchUrl]);

  // ...
}

```

忘掉 Class 组件的思维模型，用全新的思维模型来认识函数组件可能会帮助你更好掌握函数组件。不妨来试试用新的思维模型来审视一下下面函数组件例子：

```typescript
const MessageInput = (props) => {
  const { name } = props;
  const [input, setInput] = useState('');
  // 每次渲染同步数据流的变更
  const message = useMemo(() => `${name} said ${input}`, [name, input]);

  // 每次渲染后“同步” localStorage
  useEffect(() => {
    localStorage.set('lastInput', input);
  }, [input]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  // 同步数据流到组件树、UI
  return (
    <div>
      <input onChange={handleInputChange} />
      <div>{message}</div>
    </div>
  )
}

```

最后，考虑下这两种实现渲染过程会有什么不同？

```typescript
// 方式 1
const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    setCanSubmit(!!(name.trim() && email.trim()));
  }, [name, email]);

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  return (
    <form>
      <input onChange={handleNameChange} />
      <input onChange={handleEmailChange} />
      <button type='submit' disabled={!canSubmit}>Submit</button>
    </form>
  )
}

// 方式 2
const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const canSubmit = !!(name.trim() && email.trim());

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  return (
    <form>
      <input onChange={handleNameChange} />
      <input onChange={handleEmailChange} />
      <button type='submit' disabled={!canSubmit}>Submit</button>
    </form>
  )
}

```
