# 自律工作台 · 部署信息

## 永久访问地址（推荐，已验证）
```
https://ytzhao2026.github.io/work/
```
- GitHub Pages 官方托管，永久有效，不会 404 / 认证失败
- 仓库：https://github.com/ytzhao2026/work
- 部署方式：Deploy from a branch → main → /(root)

## 手机添加到主屏幕
1. Safari 打开上面的永久地址
2. 点底部 ⬆ 分享 → 「添加到主屏幕」→ 名称「自律工作台」
3. 桌面小组件地址替换为此链接

## 备用临时地址（cloudflared 隧道，沙箱休眠后可能变）
```
https://triumph-involving-physics-composer.trycloudflare.com
```

## 本地更新代码流程（如需改内容后重新部署）
```bash
cd /workspace
git add index.html
git commit -m "更新工作台"
git push origin main
# GitHub Pages 会自动重新构建，1-3 分钟后生效
```
