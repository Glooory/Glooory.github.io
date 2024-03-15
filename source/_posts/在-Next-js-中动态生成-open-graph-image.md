---
title: 在 Next.js 中动态生成 open graph image
date: 2024-03-13 14:26:48
tags:
  - Next.js
  - OGP
categories:
  - 前端技术
---

根据 [The Open Graph protocol](https://ogp.me/)，可以在网页的 HTML 文档里面加入特定的 metadata，当用户分享网页链接到社交媒体、即时通讯等 App 时，有些 App 会根据这些 metadata 显示一些该网页预览信息，比如网站的标题、简介和一张预览图，这些信息比单纯的一个链接更丰富，也可能更加有利于分享和传播，类似下面这样的效果：

![](https://raw.githubusercontent.com/Glooory/images/master/blog/open_graph_image_sample.png)

当然，并不是所有的社交媒体、即时通讯 App 都有这个功能，网页侧能做的也只能做好自己这边的事情，网页侧要实现 OGP 比较简单，只需在 HTML 文档里面加上对应的 metadata 即可，类似下面这样：
```
<html>
<head>
...
<meta property="og:title" content="肖申克的救赎 The Shawshank Redemption">
<meta property="og:type" content="video.movie">
<meta property="og:image" content="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp">
<meta property="og:url" content="https://movie.douban.com/subject/1292052/">
<meta property="og:description" content="一场谋杀案使银行家安迪（蒂姆•罗宾斯 Tim Robbins 饰）蒙冤入狱，谋杀妻子及其情人的指控将囚禁他终生。在肖申克监狱的首次现身就让监狱“大哥”瑞德（摩根•弗里曼 Morgan Freeman ...">
...
</head>
...
</html>
```

这里主要讨论如何在 Next.js 中实现 open graph image，以及如何动态生成 open graph image。  

在 Next.js 中实现静态的 open graph image 非常简单，只需在对应的路由文件夹里面放上 `opengraph-image.(jpg|jpeg|png|gif)` 文件即可（例如： `app/about/opengraph-image.png`），这样 about 页面就有了对应的 open graph image。  

除了使用静态图片， [Next.js 还支持使用代码动态生成 open graph image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx)，和上面一样，只需在对应的路由文件夹里面放上 `opengraph-image.(js|ts|tsx)` 文件，然后实现这个文件里面生成图片的逻辑即可，因为这里是执行代码生成图片，所以能够做到使用静态图片做不到的事情，比如根据 URL 里面的参数值不同生成不同的预览图片，还可以在服务器端请求其他的 API 数据来动态生成不同的图片。  

最简单的方式是使用 `next/org` 提供的 [ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response) 来生成 open graph image，类似下面这样：
```typescript
// app/blog/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const contentType = 'image/png'
  
// 默认导出生成图片的函数
// 注意：这里的参数只能是动态路由对应的参数，query 里面的参数是获取不到的，所以不能基于 query 里面的参数值来生成不同的图片
export default async function Image({ params }: { params: { id: string } }) {
  // 还可以请求其他的 API 数据
  const someOtherData = await fetch("xxxx url")
  
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {someData.xxx}
      </div>
    ),
  )
}
```

由于 `og:url` 对应的值只能使用绝对路径（base64 格式的图片也不行），如果是动态生成的图片，需要在根 layout 文件里面设置 metadataBase 的值，类型下面这样：

```typescript
// app/layout.tsx
export function generateMetadata(): Metadata {
  const metadata: Metadata = {
    title: "xxxx",
    description: "xxxx",
  }

  if (process.env.NEXT_PUBLIC_APP_HOST) {
    metadata.metadataBase = new URL(process.env.NEXT_PUBLIC_APP_HOST)
  }

  return metadata
}
```
> 注意，metadataBase 这里有个坑， metadataBase 值只会在 production 环境下才会有效，开发环境这个值始终是 `http://localhost:3000`。

可以看到 Next.js 对于 open graph image 的支持还是比较好的，就是开发环境不太好测试，我也没找到特别好的解决办法，目前只能手动检查下 HTML 里面的 meta 标签内容，然后再打开 open graph image 的 url 看看图片是不是正确。