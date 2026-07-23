-- ZenZoo database schema.
-- Run this once in the Supabase Dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: every statement is guarded with "if not exists" / "or replace".

-- ── profiles ──────────────────────────────────────────────────────────────
-- One row per parent, 1:1 with auth.users. Holds display info; the actual
-- credentials (email/password) live in Supabase Auth, not here.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Parent',
  avatar text not null default '👩',
  color text not null default '#6C5CE7',
  pin text,
  security_question text,
  security_answer text,
  language text not null default 'en',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Parent'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── children ──────────────────────────────────────────────────────────────
-- One row per child profile. Owned by exactly one parent (auth.users row).
-- Journal/mood entries and inventory are kept as JSON on the row rather than
-- their own tables — keeps reads/writes to one round trip per child.
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age_group text not null default 'Preschool (4-6)',
  genetics jsonb not null default '{"bodyColor":"#FFD3B6","eyes":"Wonder","hair":"None","species":"Bear"}',
  equipped jsonb not null default '{"Backgrounds":"bg_meadow","Hats":null,"Outfits":null}',
  owned_items jsonb not null default '["bg_meadow"]',
  calm_coins integer not null default 0,
  streak integer not null default 1,
  journal_entries jsonb not null default '[]',
  mood_entries jsonb not null default '[]',
  screen_time_minutes integer not null default 0,
  focus_minutes integer not null default 0,
  focus_sessions_completed integer not null default 0,
  breathing_sessions integer not null default 0,
  total_coins_earned integer not null default 0,
  longest_streak integer not null default 1,
  shop_locked boolean not null default false,
  daily_limit_minutes integer,
  bedtime_hour integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.children enable row level security;

drop policy if exists "Parents can view own children" on public.children;
create policy "Parents can view own children" on public.children
  for select using (auth.uid() = parent_id);

drop policy if exists "Parents can insert own children" on public.children;
create policy "Parents can insert own children" on public.children
  for insert with check (auth.uid() = parent_id);

drop policy if exists "Parents can update own children" on public.children;
create policy "Parents can update own children" on public.children
  for update using (auth.uid() = parent_id);

drop policy if exists "Parents can delete own children" on public.children;
create policy "Parents can delete own children" on public.children
  for delete using (auth.uid() = parent_id);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists children_set_updated_at on public.children;
create trigger children_set_updated_at
  before update on public.children
  for each row execute procedure public.set_updated_at();

create index if not exists children_parent_id_idx on public.children(parent_id);
