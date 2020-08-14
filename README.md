## 灵感来自

[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

[disoul/electron-cloud-music](https://github.com/disoul/electron-cloud-music)

[darknessomi/musicbox](https://github.com/darknessomi/musicbox)

[sqaiyan/netmusic-node](https://github.com/sqaiyan/netmusic-node)

## 写在前面

![https://blog.52craft.cc/index.php/archives/19/](https://img.shields.io/badge/build-v1.4.0-green)

对于上一个热评墙的坑并不是很满意的说！  
那么...再开一个！   
这次我将会追逐于，轻量化，用户体验，响应方式。    
对此，我使用了

![http://idangero.us/swiper/](https://img.shields.io/badge/Swiper-v5.3.0-green)     
![https://jquery.com/](https://img.shields.io/badge/jQuery-v3.4.1-green)    
![https://binaryify.github.io/NeteaseCloudMusicApi/](https://img.shields.io/badge/API-v3.25.0-green)    

## 开发日志

### Version 0.0.1

- 创建轮子
- 基本架构
 - 前端页面由Kevin提供！(感觉很棒，但是在所谓的X5内核下强到掉帧)
 - 简单初步调用上文所属的组件
- 调用接口[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/)
- 排行榜和歌单的热评墙雏形已成

### Version 0.0.5

- 更新前端页面适应以及减少花里胡哨的内存占用

### Version 1.0.0

- 他终于被我issue了上了仓库
> 这一个版本几乎大改...
- 修改了界面的样式
- 整理了逻辑，重构了所有该存在的不该存在的
- 他依旧没有方法去逐步调用（反正我喜欢）

### Version 1.1.0

- 加入了断点续连
- 双击刷新评论
- 一些监听的优化
- 一些样式的修改

### Version 1.2.0

- 修复了一个Bug
- 修复了两个Bug
- 修复了三个Bug
- 修复了四个Bug
- 修复了五个Bug
- 修复了六个Bug

### Version 1.3.0

- 修复了一个Bug
- 新增点击名称复制内容
- 修复了背景的使用过度
- 增加了缓存机制，减少资源占用

### Version 1.4.0

- 对原来的断线机制不太满意（有重复）所以改了一下
- 更新了样式
- 避免页面曝光度太大，增加了补偿

## 安装

开箱即用速食方法

`git clone https://github.com/PluginsKers/NeteaseCloudHotReview.git`
