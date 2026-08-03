# 自律工作台 · 部署与配置说明

## ✅ 永久访问地址（国内可达，已验证）

```
https://willowy-seahorse-ff9b2d.netlify.app/
```

- Netlify 托管，国内稳定可达，不会 404 / 认证失败
- 已接入 Supabase 云端同步 + 打卡 + 自动保存 + 历史折叠 + PWA
- 代码仓库：https://github.com/ytzhao2026/work（推送即自动重新部署）

## 手机安装到主屏幕
1. Safari 打开上面的 Netlify 地址
2. 点底部 ⬆ 分享 → 「添加到主屏幕」→ 名称「自律工作台」
3. 以后从主屏图标打开即为 APP 形式，离线也能用（Service Worker 缓存）

## 云端同步说明
- 顶栏标识：`● 仅本地 / ● 同步中 / ● 已连云端 / ● 同步失败`
- 数据自动存本地 + 防抖同步到 Supabase（多设备共享）
- 若手机网络暂不可达 Supabase，显示「同步失败」但本地数据不丢，联网后自动补传
- Supabase 项目：znvkndipqlhshrmmaxmd.supabase.co（表 workbench_data）

## 功能清单（本次升级）
- ✅ PWA 可安装到主屏（manifest + Service Worker 离线缓存）
- ✅ Supabase 云端同步（需配置，见下）
- ✅ 输入自动保存（计划三件事边写边存，防抖）
- ✅ 打卡系统（计划/英语/体态，含连续天数统计）
- ✅ 历史数据按日期折叠（计划历史默认折叠更早记录）
- ✅ 顶部连接状态标识（仅本地 / 同步中 / 已连云端 / 同步失败）
- ✅ 外部视频一键跳转原平台（B站/抖音/小红书/豆瓣）
- ✅ 数据导出/导入备份（侧边栏「💾 数据备份」）

## 启用 Supabase 云端同步（3 步）
1. 打开 https://supabase.com → 新建项目（免费）
2. 后台 SQL Editor 执行仓库内 `supabase-schema.sql`
3. Settings → API 复制 **Project URL** 和 **anon public key**
4. 把这两个值发给我，我填入 `index.html` 顶部的
   `SUPABASE_URL` / `SUPABASE_ANON_KEY` 即可多设备同步

## 永久稳定托管（推荐 Netlify，免费）
1. 注册 https://netlify.com （邮箱即可）
2. 进入站点后「Add new site → Deploy manually」拖入本仓库文件
   或把仓库连到 Netlify 自动部署
3. 得到 `xxx.netlify.app` 地址，国内可达，永久有效
4. 告诉我，我可帮你完成部署与配置

## 本地更新代码流程
```bash
cd /workspace
git add -A
git commit -m "更新工作台"
git push origin main   # GitHub Pages 自动重建（若用 GitHub 托管）
```
