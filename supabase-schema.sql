-- 自律工作台 · Supabase 云端同步表结构
-- 在 Supabase 后台 → SQL Editor 中粘贴执行本脚本

create table if not exists workbench_data (
  uid         text primary key,
  payload     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz default now()
);

-- 启用行级安全（RLS）
alter table workbench_data enable row level security;

-- 匿名（anon）可读写同一记录，实现多设备共享一个工作台
-- ⚠️ 这是单人共享方案；若需多用户隔离，请改为基于 auth.uid() 的策略
drop policy if exists "workbench_anon_all" on workbench_data;
create policy "workbench_anon_all"
  on workbench_data
  for all
  to anon
  using (true)
  with check (true);

-- 方便查看数据
comment on table workbench_data is '自律工作台云端数据：payload 为各模块键值对（值已 JSON 字符串化）';
