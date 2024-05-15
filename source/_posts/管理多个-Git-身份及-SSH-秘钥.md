---
title: 管理多个 Git 身份及 SSH 秘钥
date: 2024-05-15 09:57:33
tags: [Git]
categories:
  - 编程技术
---

还记得当初刚进公司工作时犯的第一个还有印象的错误就是使用了个人的邮箱地址而不是公司的邮箱地址作为 Git 的身份信息提交了代码，直到现在我也还经常犯类似的错误，不过不同之处在于是在个人仓库里使用了工作邮箱，因为当初在犯错之后我就把工作邮箱设置成了 Git 的全局配置。所以这个误用 Git 身份信息的问题依然没有彻底解决，不过现在我貌似找到了问题的解决方法。

### 管理多个 Git 身份
工作一个号，生活一个号，这句话大家应该不陌生吧？如果有多个账号应该如何避免使用了错误账号的尴尬场景呢？  
Git 有个全局的配置文件(`~/.gitconfig`)可以配置全局的身份信息（用户名、邮箱），此外还可以满足某些条件时使用某种其他的配置，基于此解决问题的方案就有了，只要我们将需要不同身份的仓库放到不同的目录下，然后配置不同的目录使用不同的配置文件就可以了。  
具体的配置步骤如下（假设仓库的目录如下）：

```
~/Projects
├── work
│   ├── project1
│   ├── project2
│   └── project3
└── personal
    ├── project1
    └── project2
```

1. 首先为每个身份建立一份配置文件：

   - `~/.gitconfig-personal`
     ```
     [user]
       name = personal_name
       email = personal_email@xxx.com
     ```

   - `~/.gitconfig-work`
     ```
     [user]
       name = work_name
       email = work_email@xxx.com
     ```

2. 然后再将何时使用哪个配置文件的配置添加进 `~/.gitconfig` 文件：
    ```
    [user]
      name = default_name
      email = default_email@xxx.com

    [includeIf "gitdir:~/Projects/personal/"]
      path = ~/.gitconfig-personal

    [includeIf "gitdir:~/Projects/work/"]
      path = ~/.gitconfig-work
    ```

上面的配置就告诉 Git，`~/Projects/personal/` 目录下的仓库使用 `~/.gitconfig-personal` 配置文件，`~/Projects/work/` 目录下的仓库使用 `~/.gitconfig-work` 配置文件，这样只要将仓库放入到正确的目录下就会使用对应的身份信息了。

### 管理多个 SSH 秘钥
有时候我们需要用不同的账号在不同的平台上工作，比如个人用的 Github 账号，工作用的 Github 账号，工作用的 Gitlab 账号，客户甲对应的 Gitlab 账号，如何做到使用某个账号时使用对应的 SSH 秘钥呢？一把梭全部用同一个 SSH 秘钥也行，但是貌似不推荐？  
解决办法跟上面类似，就是先生成多个不同账号对应的 SSH 秘钥，然后再配置何时使用哪个秘钥即可。下面是具体的步骤参考（具体需要多少份 SSH 按自己需求即可，下面生成的三份只作为示例参考）：  

1. 生成对应的多个 SSH 秘钥
    ```
    $ cd ~/.ssh

    $ ssh-keygen -t rsa -b 4096 -C "personal_email@xxx.com" -f "github-personal"
    $ ssh-keygen -t rsa -b 4096 -C "work_email@xxx.com" -f "github-work"
    $ ssh-keygen -t rsa -b 4096 -C "work_email@xxx.com" -f "gitlab-work"
    ```

2. 将上面所有生成的秘钥添加到 SSH-agent 里
    ```
    $ ssh-add -K ~/.ssh/github-personal
    $ ssh-add -K ~/.ssh/github-work
    $ ssh-add -K ~/.ssh/gitlab-work
    ```

3. 将对应的公钥分别配置到对应的平台上(比如 Github 可以参考[这里](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account))

4. 在 `.ssh/config` 文件里配置什么时候使用哪个秘钥  
   下面的各 Host 最好配置成自己容易记住的，因为日后会用到它们。
    ```
    #github personal
    Host github.com-personal
      HostName github.com
      User git
      IdentityFile ~/.ssh/github-personal

    #github work
    Host github.com-work
      HostName github.com
      User git
      IdentityFile ~/.ssh/github-work

    #gitlab work
    Host gitlab.com-work
      HostName your_gitlab_hostname
      User git
      IdentityFile ~/.ssh/gitlab-work
    ```

5. 配置完成之后就是如何使用了  
   还记得上面说的会用到我们在 `.ssh/config` 里面配置的个 Host 吗，可能主要在下面两种情况下我们需要将 Git 仓库链接里面的 Host 改成我们对应配置的 Host：
   - 克隆新仓库  
     使用 `git clone` 命令克隆新仓库时，需要将 Host 改成对应的 Host，比如：
     |账号（仓库）|之前使用的命令|之后应该使用的命令|
     |---|---|---|
     |个人用 Github|`git clone git@github.com:AAA/BBB.git`|`git clone git@github.com-personal:AAA/BBB.git`|
     |工作用 Github|`git clone git@github.com:CCC/DDD.git`|`git clone git@github.com-work:CCC/DDD.git`|
     |工作用 Gitlab|`git clone git@gitlab.com-work:EEE/FFF.git`|`git clone git@gitlab.com-work:EEE/FFF.git`|
   - 之前本地已经存在的仓库需要重新更新一下对应的远端地址，比如：
     |账号（仓库）类型|对应命令|
     |---|---|
     |个人用 Github|`git remote set-url origin git@github.com-personal:AAA/BBB.git`|
     |工作用 Github|`git remote set-url origin git@github.com-work:CCC/DDD.git`|
     |工作用 Gitlab|`git remote set-url origin git@gitlab.com-work:EEE/FFF.git`|

这么配置之后就能解决我忘记修改某个 Git 仓库的身份信息问题了，挺方便的，除了每次克隆新仓库时需要问自己下面几个问题：
1. 这个仓库应该放在哪目录（`work` 还是 `personal`）下？
2. 这个仓库应该使用哪个 SSH 秘钥？

得到上面两个问题的答案之后，只需 CD 到对应目录下，修改 Git 仓库链接里面的 Host，执行 `git clone git@my-fantastic-host:awesome/amazing.git` 就行了。
