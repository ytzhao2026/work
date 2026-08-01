#!/usr/bin/env node
/**
 * 自律工作台 · 数据更新任务
 * 每天运行一次，抓取外贸热搜/行业动态，写入 /workspace/data.json
 * 前端通过 fetch('/data.json') 读取最新数据
 *
 * 运行方式: node /workspace/data-updater.js
 * Cron: 0 8 * * * (每天早上8点)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DATA_FILE = path.join(__dirname, 'data.json');

// 安全的HTTP GET（带超时）
function fetchJSON(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Self-Discipline Workbench/1.0)' }, timeout }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location, timeout).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error(`Parse error: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// 抓取阿里巴巴国际站热搜词（公开API）
async function fetchAlibabaTrends() {
  try {
    // 阿里国际站趋势词API（公开）
    const data = await fetchJSON('https://trends.alibaba.com/index.json?category=hotProducts&limit=10');
    if (data && data.result && Array.isArray(data.result)) {
      return data.result.slice(0, 8).map(item => ({
        keyword: item.keyword || item.word || item.query || '',
        growth: item.growthRate || item.growth || item.trend || '+0%',
        category: item.category || item.industry || ''
      })).filter(x => x.keyword);
    }
  } catch (e) { console.log('[WARN] 阿里热搜抓取失败:', e.message); }
  return null;
}

// 抓取海关数据公开统计（备用数据源）
async function fetchCustomsData() {
  try {
    const data = await fetchJSON('https://data.stats.gov.cn/easyquery.htm?m=QueryData&code=fsjdb/dbgsjd2023&rowcode=zb&colcode=sj&wds=%5B%7B%22wdsCode%22%3A%22sj%22%2C%22valueCode%22%3A%22LAST12%22%7D%5D', 5000);
    if (data && data.returndata && data.returndata.datanodes) {
      return { source: '国家统计局', updated: new Date().toISOString().slice(0,10), note: '外贸进出口数据已更新' };
    }
  } catch (e) { console.log('[WARN] 海关数据抓取失败:', e.message); }
  return null;
}

// 生成外贸高频热词（内置兜底 + 网络抓取混合）
function generateHotKeywords(fetched) {
  // 内置外贸核心词汇池（永远可用）
  const builtin = [
    'MOQ(最小起订量)', 'FOB(离岸价)', 'CIF(到岸价)', 'Lead time(交期)',
    'OEM代工', 'ODM设计', 'Incoterms贸易术语', 'PI形式发票',
    'SC销售确认', 'B/L提单', 'T/T电汇', 'L/C信用证',
    'Sample样品', 'Packing list装箱单', 'Customs clearance清关',
    'Quality inspection验货', 'Warranty质保', 'After-sales售后'
  ];

  if (fetched && fetched.length > 0) {
    // 混合：取前4个网络热词 + 前14个内置词
    const netWords = fetched.slice(0, 4).map(x => x.keyword);
    return [...netWords, ...builtin].slice(0, 18);
  }

  return builtin;
}

// 主函数
async function main() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] 数据更新任务开始`);

  let alibabaData = null;
  let customsInfo = null;

  // 并行抓取（带超时保护）
  try {
    [alibabaData, customsInfo] = await Promise.allSettled([
      fetchAlibabaTrends(),
      fetchCustomsData()
    ]);
    alibabaData = alibabaData.status === 'fulfilled' ? alibabaData.value : null;
    customsInfo = customsInfo.status === 'fulfilled' ? customsInfo.value : null;
  } catch (e) {
    console.log('[WARN] 并行抓取异常:', e.message);
  }

  // 读取现有数据
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) { /* 首次运行 */ }

  // 构建新数据
  const newData = {
    updatedAt: new Date().toISOString(),
    english: {
      source: 'builtin',
      note: '使用内置21天外贸场景池，每日自动轮换',
      hotKeywords: generateHotKeywords(alibabaData)
    },
    body: {
      source: 'builtin',
      note: '使用内置4周体态轮换池（圆肩/小腿/减压/骨盆）'
    },
    books: {
      source: 'builtin',
      note: '使用内置7学科书单池，每月3本渐进推荐'
    },
    trends: {
      alibaba: alibabaData || null,
      customs: customsInfo || null,
      fetchedAt: new Date().toISOString()
    }
  };

  // 写入文件
  fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf-8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[${new Date().toISOString()}] ✅ 数据更新完成 (${elapsed}s)`);
  console.log(`   热词数: ${newData.english.hotKeywords.length}`);
  console.log(`   阿里热搜: ${alibabaData ? alibabaData.length + '条' : '未获取'}`);
  console.log(`   海关数据: ${customsInfo ? '已更新' : '未获取'}`);

  return newData;
}

// 执行
main().catch(e => {
  console.error('[ERROR] 数据更新失败:', e.message);
  process.exit(1);
});
