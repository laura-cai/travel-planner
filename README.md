# 旅行计划

只有 Plan A / Plan B / Plan C 折叠表格，包含日期、航线、航司、买票链接、每人原币价格、转机信息。Plan A 默认打开。

点击编辑修改或添加航段，点击「新增 Plan」添加其他组合。修改自动保存在本机浏览器，刷新不丢失。预置的是2026/10/23历史报价，不是实时查价。

## 部署到 GitHub Pages

1. 把文件夹内文件上传到你的 GitHub 仓库根目录。
2. Settings → Pages → Source 选择 **Deploy from a branch**，分支选 `main`，目录选 `/(root)`。
3. 保存，等待部署完成，打开 Pages 提供的网址。

不需要安装依赖或构建。也附了 `.github/workflows/pages.yml`，如果想用 Actions 部署，把 Source 改选 GitHub Actions 即可。两种方式任选一种。

## 可选：两个人跨设备共同编辑

GitHub Pages 只有静态托管，默认本机保存**不会跨设备同步**。云端同步功能已包含在代码中，需要你自己的 Supabase 项目；无需 ChatGPT 或其他用户账号登录。

1. 创建 [Supabase](https://supabase.com/) 项目。
2. 在项目 SQL Editor 运行本目录 `supabase.sql`。
3. 编辑 `config.js`，填入该项目的 `url` 和 Publishable key 或旧版 anon public key。**不要使用 secret / service_role 管理员密钥。**这两个公开配置可提交GitHub。
4. 重新部署。首次打开后浏览器地址会自动带上随机的 `#room=...`。
5. 将浏览器**完整地址（含#room）**发给对方，你们就会编辑同一个看板。保存后同步，每10秒拉取更新。

持有完整地址的人都可以读写，不要将带房间密钥的完整地址发布到公开仓库。数据库只保存房间密钥的SHA256摘要。相同房间同时保存时会提示冲突，并保留本机编辑。点击提示里的「导出本机备份」，再点击「载入云端版本」，之后手动合并即可。

这是保存后同步的共享表格，不是同时显示双人光标的在线文档。尚未连接真实Supabase项目验证，部署后请用两个浏览器窗口测试同步与冲突提示。

## 本地预览

在本目录运行 `python3 -m http.server 8080`，打开 `http://localhost:8080`。通过HTTP访问；直接双击HTML会受浏览器模块限制。
