---
title: 删除 macOS 自带的 ABC 输入法
date: 2025-01-23 10:18:25
tags: [macOS]
categories:
---

这几天又被 macOS 自带的 ABC 输入法烦到了，总是要按几次 `Control + Space` 或者 `Shift` 来切换到想要的输入法，受不了了再次决定删掉它，只保留一个输入法会减少很多切换输入法的烦恼。  
其实之前我已经删除过了，由于使用 Blender 时发现其快捷键失效了，怀疑是输入法的问题，于是又把 ABC 输入法加回来了验证下，果然是输入法的问题，然后就一直让它苟活到了现在。

#### 关闭 SIP
1. 重启系统，按住 `Command + R`(好像 M 系列芯片的电脑长按电源键也行) 进入恢复模式。
2. 点击顶部菜单栏`实用工具`中的`终端` 。
3. 输入 `csrutil disable` 命令来关闭 SIP，会提示是否继续，按下 `Y` 键即可继续。
4. 执行后输出 `System Integrity Protection is off. Restart the machine for the changes to take effect. ` 则表示关闭成功。
5. 重启系统。

#### 删除 ABC 输入法
1. 打开终端，输入命令 `open ~/Library/Preferences`。
2. 在新打开的 Finder 窗口里找到 `com.apple.HIToolbox.plist` 文件，使用 XCode 打开该文件。
3. 依次点开 `Root` - `AppleEnabledInputSources`，依次点开 `ItemX`，找到 `Value` 列为 `ABC` 的那个 Item 删掉，按 `Command + S` 保存。
![](https://raw.githubusercontent.com/Glooory/images/master/blog/HIToolbox-plist-delete-ABC.png)
4. 马上在 Finder 窗口里右键 `com.apple.HIToolbox.plist` 文件，点击`显示简介`，然后把 `通用` 栏下面的 `已锁定` Checkbox 勾上，不然我们的修改会马上被系统还原回去。
5. 重启系统。

#### 重新开启 SIP
- 如果需要的话，可以重新开启 SIP，步骤跟关闭 SIP 时一样，只是命令换成 `csrutil enable` 即可。

如果后续可能发现由于输入法导致的问题可以随时再把 ABC 输入法加回来（`系统设置` - `键盘` - `输入法`）即可。
