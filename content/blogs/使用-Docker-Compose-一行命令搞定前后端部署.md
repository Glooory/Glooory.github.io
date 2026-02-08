---
title: 使用 Docker Compose 一行命令搞定前后端部署
publishedAt: 2020-01-09 15:44:36
tags:
  - Docker
categories:
  - 经验杂谈
---

前段时间由于要部署一个应用服务，前、后端代码都是我一个前端完成的，最终在公司后端同事的指导下用 Docker 来部署了这个项目。考虑到项目前后端是分离的，同事建议使用 [Docker Compose](https://docs.docker.com/compose/) 来管理整个应用服务，Docker Compose 是一个可以用来定义和运行多容器的 Docker 应用工具，它可以很方便地按照预先的配置文件启动多个容器服务，这里我们用它来同时运行前端和后端的服务。

#### 项目目录结构

项目的前后端是分离的，但是代码放在了同一仓库里，大致结构见下图：

```
.
├── frontend/                       // 前端代码
├── backend/                        // 后端代码
└── docker-compose.yml              // Docker Compose 配置文件
```

接下来我们来看一下使用 Docker 运行前后端各自的服务需要做些什么。

#### 前端

先来看下前端部分，前端需要正常运行工作只需要两样东西，一个是项目打包后的资源文件，另一个就是 Web 服务器。打包这个工作我们也可以交给 Docker 帮我们完成，Web 服务器我们这里使用 Nginx，分析完需求我们下面看看具体前端部分的 Dockerfile 文件：

```yaml
# 由于要先打包再启动 Web 服务器，我们这里用到了 Docker 的 multi-stage builds 特性
# 第一阶段我们要先打包前端代码

# FROM 指令声明本阶段构建基于的基础镜像，这里打包需要 node 环境，所以选择官方的 node 镜像作为基础镜像
# 使用 AS <NAME> 来为本阶段构建命名，可以方便后面引用
FROM node:8.17.0-alpine AS builder

# 声明镜像内的工作目录，随后的指令都会在这个工作目录下执行
WORKDIR /usr/src/app

# 拷贝本 Dockerfile 文件所在的当前文件夹下的 package.json yarn.lock 文件到工作目录下
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn

# 拷贝本 Dockerfile 文件所在的当前文件夹下的所有文件到工作目录下
COPY . .

# 打包
RUN yarn build

# 打包完成后进入创建 Web 服务器的阶段
# 还是先声明本阶段构建的基础镜像，我们这里使用 nginx
FROM nginx:1.17-alpine

# 拷贝上一构建阶段(--from来指定)构建完成后的指定资源到镜像中我们想要放置的目录
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# 拷贝我们配置好的 nginx 配置文件到镜像里的特定目录下作为 nginx 的默认配置文件
COPY nginx.conf /etc/nginx/

# 设置容器启动时的默认命令
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端

项目的后端是使用 Node.js 实现的，所以这里只需要 node 环境即可，具体的 Dockerfile 如下：

```yaml
# 先声明构建的基础镜像，这里使用 node
FROM node:8.17.0-alpine

# 声明工作目录
WORKDIR /usr/src/app

# 拷贝 package*.json 文件到工作目录(这里匹配文件名时使用到了正则)
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 拷贝项目的资源文件到工作目录
COPY . .

# 设置容器启动时的默认命令
CMD ["npm", "start"]
```

#### 组合前后端容器服务

当前后端的 Dockerfile 都配置好之后，我们就可以用 Docker Compose 来同时构建并启动它们了，我们可以通过 YAML 格式的文件来配置组合应用的所有服务，Docker Compose 会按照这个配置文件来创建启动所有的容器服务，示例配置文件如下：

```yaml
# 声明 Docker Compose 的版本号
version: "3"
# 定义需要启动的服务
services:
  # 服务名称
  frontend:
    # 容器名称
    container_name: myapp_frontend
    build:
      # 构建该服务镜像时的上下文， 当前文件夹下的 frontend 文件夹，即我们的前端代码目录
      context: ./frontend
      # 指定用于构建该服务镜像的 dockerfile
      dockerfile: Dockerfile
    ports:
      # 绑定端口
      - "3000:80"

  backend:
    container_name: myapp_backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3030:3030"
```

在 Docker Compose 配置文件里面定义好我们的服务之后，只需一行命令 `docker-compose up` 即可启动我们的整个应用的前后端服务啦，至此也达到了使用 Docker 部署前后端分离的项目的目的了。
