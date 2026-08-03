# 自律工作台 · 部署与配置说明

## ⚠️ 重要：托管地址说明

`github.io` 域名在国内网络下经常不可达（"已丢失网络连接"的根因）。
**要稳定打开，请用下方「当前可用地址」或部署到国内可达平台（见末尾）。**

## 当前可用地址（Cloudflare 隧道，沙箱在线时可用）
```
https://bennett-fly-replica-comes.trycloudflare.com
```
- Cloudflare 域名，国内通常可达，已接入最新版（含打卡/同步/折叠）
- 沙箱休眠后隧道可能断开，需要时重新生成链接即可

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
