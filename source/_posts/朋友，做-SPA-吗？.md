---
title: 朋友，做 SPA 吗？
date: 2021-08-23 17:36:46
tags:
  - React
  - React Router
categories:
  - 前端技术
---

### SPA / MPA

SPA 全称为 Single-page application，翻译成中文就是单页面应用，顾名思义，SPA 就是只有一个页面的网站，当然这里的页面并不是指画面，而是指的 HTML 文档，所以更具体一点的说法就是，SPA 是一个在用户每次使用周期内只会加载一个 HTML 文档，之后所有的画面呈现都是由代码去修改那个 HTML 文件来动态生成各种 UI 元素和完成交互的网站。

SPA 是相较于传统的网站而言的，传统的网站基本每个 URL 对应一个 HTML 文件，也就是 MPA（Multiple-page application，多页面应用），用户每次访问不同的画面都需要浏览器发起网络请求去获取对应的 HTML 文件然后渲染呈现给用户。在以前前后端没有分离的时代，大部分的网站都是以 MPA 的形式存在，随着前后端分离越来越流行，SPA 也逐渐成为现代网站的一个趋势，在这期间也出现了一些开发 SPA 的前端框架，例如 React、Vue、Angular 等。SPA 和 MPA 有各自的优缺点，并没有一个绝对的谁好谁坏说法，需要看具体的情况选择，这方面不是本文关注的内容这里就不展开讨论了。

### 宿主 SPA / 寄生 SPA

一般而言，一个 SPA（网站）都是由一套代码来控制的，即该 SPA 里面所有的画面、功能都是由一套代码实现的，这样的完整性有利于对网站整体的掌控，出问题了也容易排查和处理，所以一般没有特殊需要的话 SPA 都是由同一套代码来控制和实现的，可以配合下图理解。

![ * 土地可以理解为 SPA（网站），农民可以理解为一个开发团队，耕种可以理解为编写代码来绘制网页上的 UI 元素和实现交互功能。](https://raw.githubusercontent.com/Glooory/images/master/blog/spa_normal.png)

 * 土地可以理解为 SPA（网站），农民可以理解为一个开发团队，耕种可以理解为编写代码来绘制网页上的 UI 元素和实现交互功能。

我们平常接触到的大部分 SPA 都是像上图示例一样，完全由一个团队负责开发，当然，有一般的情况肯定还有些特殊情况。前段时间公司就接触到了一个有点特殊的项目，这个项目里有好几支开发团队，我们团队编写的代码只负责绘制网页上的某一个区域，而网页其他的区域则由另一个团队负责，可以配合下图理解，我们只负责某些 URL 里蓝框部分的内容，蓝框外红框内的部分是由另一个团队负责的，而且整个网站的基础设施（HTML 文件、静态资源的托管等）是由他们负责的，可以理解为我们开发的 SPA 寄生在他们开发的 SPA 里，这样理解的话，他们开发的 SPA 就可以叫做「宿主 SPA」，我们开发的 SPA 就可以叫做「寄生 SPA」，为了方便后文都采用这两种称谓。

![* 季节可以理解成 URL。](https://raw.githubusercontent.com/Glooory/images/master/blog/spa_special.png)

* 季节可以理解成 URL。

### 客观条件和不按套路出牌带来的问题

由于不按常规的 SPA 套路出牌，开发这样一个寄生 SPA 肯定会有与常规 SPA 开发不一样的地方，并且这个项目还存在一些客观限制条件，这些因素加在一起就导致会有许多问题需要解决，接下来就来具体看一下有些什么限制和问题：

存在的一些限制条件和要求：

1. 开发宿主 SPA 和寄生 SPA 的两个团队都使用到了同一个前端框架 React 来开发画面。
2. 两个团队分开作业，代码也分开管理，并且我们不具备运行宿主 SPA 的环境，所以我们开发时是没有真实的宿主 SPA 的，但是寄生 SPA 代码的执行效果只有在宿主 SPA 同时存在时才能看得见，所以我们还需要自己做成一个用来模拟宿主 SPA 的工程来辅助我们开发。
3. 寄生 SPA 的资源文件（CSS 文件、JavaScript 文件）由宿主 SPA 来加载，但是想做到寄生 SPA 的代码更新发布不依赖宿主 SPA 做任何代码上的改动和部署发布。

看完限制条件再来看看一些需要解决的问题：

1. 宿主 SPA 和寄生 SPA 之间如何通信？
2. 寄生 SPA 的代码何时执行，如何保证执行时间的正确性？
3. 由于代码分开管理，开发时我们本地模拟出来的宿主 SPA 也是一个独立的工程，两个独立的工程运行起来时，它们之间怎么联动起来？
    
    开发时两个工程联动起来是开发的前提，如果想同时保证开发效率，此时又出现了下面的两个问题：
    
    1. 如何实现寄生 SPA 工程代码改动后宿主 SPA 自动刷新画面？
    2. 如何保证其他终端（手机、虚拟机等）能通过 IP 地址访问启动起来的开发环境？
4. 寄生 SPA 的路由和画面跳转应该怎么做？
5. 寄生 SPA 的版本更新不依赖宿主 SPA 做任何代码改动就想让用户能使用最新版本，那宿主 SPA 的 HTML 应该如何加载寄生 SPA 的所有资源文件？

### 解决方案

只有上面这些问题解决了才能保证项目的顺利进展，而且大部分问题需要在项目的前期准备阶段得到解决，所以这个项目的前期准备工作比一般的项目要多许多，最开始还去验证了这种宿主 SPA 和寄生 SPA 模式的可行性。下面来看具体的每个问题以及我想到的解决方案。

1. 宿主 SPA 和寄生 SPA 之间如何通信？
    
    这个问题其实相对来说比较好解决，因为宿主 SPA 和寄生 SPA 的两套代码都是运行在同一个 JavaScript 执行环境里的，所以可以通过双方协商暴露接口到全局的执行环境，然后需要通信时调用跟对方协商好的接口就可以了。因为接口暴露到了全局执行环境，并且在浏览器里访问这个全局执行环境门槛是很低的，所以这个方案会带来一定的安全隐患。
    
2. 寄生 SPA 的代码何时执行，如何保证执行时间的正确？
    
    要解决这个问题，只要明白寄生 SPA 的工作方式就可以找到解决方案了。
    
    寄生 SPA 的职责就是去渲染画面上的某个区域，这个区域本质上就是 HTML 里面的一个空 div，我们暂且把这个空的 div 叫做占位 div 吧，寄生 SPA 的代码必须在这个占位 div 渲染好了之后再执行才正确，由于这个占位 div 是由宿主 SPA 负责渲染的，所以只需宿主 SPA 每次在渲染完占位 div 之后通知寄生 SPA 去渲染那个占位 div 就可以了，通知的方式有多种，可以是通过暴露接口的方式，也可以是通过发送自定义事件的方式，只要能在占位 div 渲染好了之后通知到寄生 SPA 就可以了。
    
3. 由于代码分开管理，开发时我们本地模拟出来的宿主 SPA 也是一个独立的工程，两个独立的工程运行起来时，它们之间怎么联动起来？
    
    两个工程启动时，只需宿主 SPA 加载寄生 SPA 的资源（CSS、JavaScript）文件就算是联动起来了，也就是宿主 SPA 的 HTML 文件里写上加载寄生 SPA 资源文件的代码就可以了，这些需要宿主 SPA 加载的有两种文件，一种是 JavaScript 文件，一种是 CSS 文件，把它们都加载进来这个问题就解决了。
    
    先看下加载 JavaScript 文件这块，一般基于 webpack 搭建起来的项目开发环境下打包出来的 JavaScript 文件名不带 hash，都是几个固定的名字（至于正式环境打包出来的文件会带有 hash 导致每次打包出来的文件名不一样问题后面会说到，这里先按住不表），这也就意味着访问这些 JavaScript 资源的 URL 也是固定的，所以只需把这几个固定的 URL 写到宿主 SPA 的 HTML 里的 script 标签里就可以了。
    
    而加载 CSS 文件方面不像加载 JavaScript 文件这样简单，因为开发环境下 webpack 默认是不会生成 CSS 文件的，而是把所有的 CSS 声明全部写入到了 HTML 里的 style 标签里，所以这里需要修改一下 webpack 的配置让其开发环境下打包时也生成 CSS 文件而不是以内部样式的形式写到 HTML 里。修改好 webpack 的配置之后再把访问这些 CSS 文件的 URL 写入到宿主 SPA 的 HTML 里就可以了。
    
    到此宿主 SPA 加载寄生 SPA 资源文件的问题就解决了，两个项目也就可以联动起来了，寄生 SPA 的代码效果就可以在浏览器里面看到了，接下来考虑如何解决开发效率上的问题：
    
    1. 如何实现寄生 SPA 工程代码改动后宿主 SPA 自动刷新画面？
        
        我们知道基于 webpack 的脚手架创建的项目开发时都自带开箱即用的自动刷新功能，这个功能可以提升开发效率，而现在我们的开发工作都集中在寄生 SPA 上，我们修改寄生 SPA 工程的代码时仅能够让寄生 SPA 工程重新打包，但是宿主 SPA 是不知道寄生 SPA 完成了重新打包这个过程，所以它不会主动去刷新画面加载寄生 SPA 刚刚打包新生成的资源，也就是说我们修改代码之后画面上是不能实时反映出来我们的修改效果的，如果每次修改完代码都需要开发人员去手动刷新画面的话，这样的操作是非常低效和折磨人的，那么如何解决这个问题呢？
        
        开发环境下 webpack 的每次重新打包完成后就会自动刷新浏览器的画面，知道这点之后就可以从这里寻找解决方案。每次寄生 SPA 的代码改动之后，寄生 SPA 工程会自动重新打包，只需要在寄生 SPA 每次重新打包之后让宿主 SPA 再自动重新打下包就可以了，这样宿主 SPA 重新打包之后就是加在的最新的寄生 SPA 的资源了，于是现在问题就变成了如何让宿主 SPA 在每次寄生 SPA 自动打包后再自动打包？
        
        那有没有办法让寄生 SPA 打包完成之后去通知宿主 SPA 自动重新打包呢？我之前研究了一下没有发现现成的、便捷的方式来实现两个 webpack devServer 之间的通信，两个工程之间直接通信这条路看来是行不通了，只有寻找其他方式来解决这个问题。我们知道 webpack 会收集整个项目的依赖，然后在其内部生成一个依赖图，开发环境下，如果某个依赖发生了变化，webpack 就会重新打包，所以我们可以依靠这个机制来达到我们的目的，所以最后我想到的解决方案就是在寄生 SPA 每次打包完成之后去修改宿主 SPA 工程里的某一个文件，这个文件必须是宿主 SPA 工程里的一个依赖，这样就可以实现寄生 SPA 每次打包之后触发宿主 SPA 也重新打包，然后画面就会自动刷新反映我们的代码改动了，这个解决方案的实现是需要写一个自定义的 webpack plugin 来做这件事情，这个自定义 webpack plugin 需要在每次寄生 SPA 打包完成之后去修改宿主 SPA 工程里面的某个文件，该 webpack plugin 实现代码参考：
        
        ```jsx
        const fs = require('fs');
        
        class HostSPARebuildTriggerPlugin {
          apply(compiler) {
        		// 在打包完成之后执行
            compiler.hooks.done.tap('HostSPARebuildTriggerPlugin', function (compilation) {
        			// 每次打包完成之后去动态更新某个特定 TypeScript 文件里的内容
        			// 这个 TypeScript 文件必须是宿主 SPA 里面引用到的，不然文件内容变更不会触发宿主 SPA 自动打包
              // 所以我们这里写入的内容是 export 一个变量，然后再在宿主 SPA 里面某个地方导入使用这个变量就可以了
              const fileContent = `export const MEANINGLESS_STUFF = '${Date.now()}';`;
              fs.writeFile('宿主 SPA 工程的某个文件夹/webpack-dev-rebuild-trigger.ts, fileContent, () => {});
            });
          }
        }
        
        module.exports = { HostSPARebuildTriggerPlugin };
        ```
        
    2. 如何保证其他终端（手机、虚拟机等）能通过 IP 地址访问启动起来的开发环境？
        
        解决这个问题只需让宿主 SPA 通过本机的 IP 地址加端口号的形式加载寄生 SPA 的资源就可以了，本机的 IP 地址可以通过 node.js 的接口获取得到，寄生 SPA 的 devServer 端口号也知道，开发环境下打包出来的文件名都是固定的，所以把这三个东西拼起来就得到访问寄生 SPA 资源的 URL 了，宿主 SPA 通过这些 URL 加载寄生 SPA 的资源之后，同一个局域网里的其他终端就可以通过 IP 地址访问宿主 SPA 和寄生 SPA 了。
        
    
4. 寄生 SPA 的路由和画面跳转应该怎么做？
    
    在这次的项目里，由于宿主 SPA 和寄生 SPA 都是使用的 React 框架，所以这个问题还是比较好解决的，要解决这个问题需要知道一个关键点，也就是 React Router 是怎么工作的，React Router 做的事情大致就是根据 URL 决定渲染什么组件，而画面迁移功能是 React Router 底层依赖的是另一个叫做 history 的库来实现的，所以如果双方共用一个 history 来做画面迁移的话就可以保证画面跳转不会出现问题，并且各自还是可以按照常规的方式配置使用 React Router，只是寄生 SPA 的 Router 使用方式稍微有一点不一样，它需要的 history 是宿主 SPA 传过来的，并且当 URL 发生变更时寄生 SPA 不需要重新刷新画面，而是让宿主 SPA 通知寄生 SPA 什么时候去渲染画面，所以寄生 SPA 的 Router 是不需要监听 URL 变更的，这点也是一个隐藏比较深的问题，宿主 SPA 的 Router 没有什么特别的地方，但宿主 SPA 需要把自己的 history 对象暴露给寄生 SPA。下面是寄生 SPA 的 Router 大致实现：
    
    ```jsx
    // Router.ts    寄生 SPA 的 Router 实现
    const isDevEnv = process.env.NODE_ENV === 'development';
    const routerStaticContext = isDevEnv ? null : {};
    
    const Router: React.FC = () => {
    	// history 对象由宿主 SPA 提供，两个工程使用同一个 history 对象来做画面跳转。
      const { history } = window.HOST_SPA_APIS.router;
    
      return (
        // staticContext 值为 null 时，ReactRouter 不会响应 URL 的变化，也就是 URL 变化时不会重新 render
    		// 这里需要区分下环境，开发环境需要响应 URL 的变化，正式环境不需要
        <ReactRouter history={history} staticContext={routerStaticContext}>
          <Switch>
            <Route path={xxx} exact component={xxxx} />
            <Route path={xxxx} exact component={xxxxx} />
          </Switch>
        </ReactRouter>
      );
    };
    
    export default Router;
    ```
    
5. 寄生 SPA 的代码更新发布不依赖宿主 SPA 做任何代码改动就想让用户能使用最新版本，那宿主 SPA 的 HTML 应该如何加载寄生 SPA 的所有资源文件？
    
    一般情况下基于 webpack 的脚手架工具打正式环境的包时，会在文件名里面加上 hash，所以寄生 SPA 工程每次打包正式环境的文件名都会有变化，如果想要让用户访问到最新的寄生 SPA 资源，那么自然需要去修改宿主 SPA 的 HTML 里加载寄生 SPA 资源的部分的 URL，而这增加了宿主 SPA 团队的工作，这对于他们团队来说是不能接受的，那么如何规避掉这个问题呢？
    
    如果宿主 SPA 里只加载一个固定 URL 的 JavaScript 文件，我们这里称这个 JavaScript 文件为寄生 SPA 的入口文件，再由这个 JavaScript 文件里的代码执行时去动态地加载寄生 SPA 所有的资源文件，这样的话这个问题就解决了。由于每次寄生 SPA 打包出来的资源文件名可能都不一样，所以需要每次打包完成之后去动态的生成这个入口 JavaScript 文件，并且这个寄生 SPA 的入口 JavaScript 文件是不允许浏览器缓存的，这样就能保证宿主 SPA 每次加载的是最新的寄生 SPA 了。代码实现这些的话还是需要自定义一个 webpack plugin，大致实现参考下面：
    
    ```jsx
    // GenerateEntryJSPlugin.js   动态生成寄生 SPA 入口 JavaScript 文件的 webpack plugin
    const path = require('path');
    const fs = require('fs');
    
    function generateEntryJSContent(cssFileUrls, jsFileUrls) {
      const loadExternalSourceFileFnText = `function loadExternalCSSFile(cssUrl) {
      if (!cssUrl) return;
      var cssFileName = cssUrl.split('/');
      cssFileName = 'react_renderer_' + cssFileName[cssFileName.length - 1];
      if (!document.getElementById(cssFileName)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssFileName;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        link.media = 'all';
        head.appendChild(link);
      }
    }
    
    function loadExternalScriptFile(scriptUrl) {
      if (!scriptUrl) return;
      var jsFileName = scriptUrl.split('/');
      jsFileName = 'react_renderer_' + jsFileName[jsFileName.length - 1];
      if (!document.getElementById(jsFileName)) {
        var scriptElem = document.createElement('script');
        scriptElem.id = jsFileName;
        scriptElem.src = scriptUrl;
        document.body.appendChild(scriptElem);
      }
    }
    
    `;
    
      const loadCSSFileCalls = cssFileUrls.map((file) => `loadExternalCSSFile('${file}');\n`).join('');
      const loadJSFileCalls = jsFileUrls.map((file) => `loadExternalScriptFile('${file}');\n`).join('');
    
      return `${loadExternalSourceFileFnText}${loadCSSFileCalls}${loadJSFileCalls}`;
    }
    
    class GenerateEntryJSPlugin {
      apply(compiler) {
        // 每次打包文件生成之后执行
        compiler.hooks.afterEmit.tap('GenerateEntryJSPlugin', function (stats) {
          const entryJSFilePath = path.resolve(__dirname, './../../dist/static/js/entry.js');
          const cssFilesDir = path.resolve(__dirname, './../../dist/static/css');
          const jsFilesDir = path.resolve(__dirname, './../../dist/static/js');
          // App 资源部署在服务器上的路径
          let appPublicPath = process.env.REACT_APP_REACT_RENDERER_STATIC_ASSETS_BASE_URL;
          if (typeof appPublicPath === 'string' && appPublicPath.endsWith('/')) {
            appPublicPath = appPublicPath.substring(0, appPublicPath.length - 1);
          }
    
          const cssFileUrls = [];
          const jsFileUrls = [];
          const jsFileOrders = {};
    
          // 读取磁盘上生成的打包出来的 CSS 文件名，生成访问该资源的 URL
          fs.readdirSync(cssFilesDir).forEach((file) => {
            if (!file.endsWith('.css')) return;
            const filePath = `${appPublicPath}/static/css/${file}`;
            cssFileUrls.push(filePath);
          });
    
          // 读取磁盘上生成的打包出来的 JavaScript 文件名，生成访问该资源的 URL
          fs.readdirSync(jsFilesDir).forEach((file) => {
            if (!file.endsWith('.js')) return;
            const filePath = `${appPublicPath}/static/js/${file}`;
            jsFileUrls.push(filePath);
          });
    
          // 动态生成入口 JavaScript 文件的代码，然后写到磁盘上
          const entryJSContent = generateEntryJSContent(cssFileUrls, jsFileUrls);
    
          fs.writeFile(entryJSFilePath, entryJSContent, () => {});
        });
      }
    }
    
    module.exports = { GenerateEntryJSPlugin };
    ```
    
    然后寄生 SPA 每次打包后会多生成一个固定路径和名字的入口 JavaScript 文件，这个文件里面的内容也是每次打包后动态生成的，宿主 SPA 的 HTML 里只需写上一行加载这个入口 JavaScript 文件的代码就可以了，由于它的路径和名字都不会变，所以它的 URL 是固定的，唯一需要注意的是不能让浏览器长时间缓存这个入口文件。
    
    ![寄生 SPA 打包后生成的资源目录一览，entry.js 就是上文说的入口文件，每次打包时动态生成。](https://raw.githubusercontent.com/Glooory/images/master/blog/spa_dist.png)
    
    寄生 SPA 打包后生成的资源目录一览，entry.js 就是上文说的入口文件，每次打包时动态生成。
    
    ```jsx
    // entry.js
    function loadExternalCSSFile(cssUrl) {
      if (!cssUrl) return;
      var cssFileName = cssUrl.split('/');
      cssFileName = 'react_renderer_' + cssFileName[cssFileName.length - 1];
      if (!document.getElementById(cssFileName)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssFileName;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        link.media = 'all';
        head.appendChild(link);
      }
    }
    
    function loadExternalScriptFile(scriptUrl) {
      if (!scriptUrl) return;
      var jsFileName = scriptUrl.split('/');
      jsFileName = 'react_renderer_' + jsFileName[jsFileName.length - 1];
      if (!document.getElementById(jsFileName)) {
        var scriptElem = document.createElement('script');
        scriptElem.id = jsFileName;
        scriptElem.src = scriptUrl;
        document.body.appendChild(scriptElem);
      }
    }
    
    // 加载寄生 SPA 所有的资源文件
    loadExternalCSSFile('/react/static/css/2.8fdb83f5.chunk.css');
    loadExternalCSSFile('/react/static/css/main.dec7047a.chunk.css');
    loadExternalScriptFile('/react/static/js/runtime-main.16677420.js');
    loadExternalScriptFile('/react/static/js/2.3572edea.chunk.js');
    loadExternalScriptFile('/react/static/js/main.dcfd72f1.chunk.js');
    ```
    

到此上面所有问题都找到了解决方案，寄生 SPA 的开发和打包都可以像常规的 SPA 一样进行了，不同的地方就是启动开发环境需要把宿主 SPA 和寄生 SPA 两个项目同时启动起来，另外一个不同之处就是寄生 SPA 的开发环境不支持 HMR，这点对开发效率来说是有影响但是不是很大，还可以接受。

既然问题都解决了，那就开始愉快地做（搬） SPA （砖）吧。
