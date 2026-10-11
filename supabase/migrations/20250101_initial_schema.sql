-- LinkVault Complete PostgreSQL Schema for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text default 'Sanket Kothiya',
    avatar_url text,
    theme_preference text default 'dark' check (theme_preference in ('dark', 'light', 'system')),
    daily_quote text default 'Collect what inspires you, Build what you dream.',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categories Table
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    slug text not null,
    color text default '#6366f1',
    icon text default 'folder',
    description text,
    display_order int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Collections Table
create table if not exists public.collections (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    is_smart boolean default false,
    smart_rules jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Resources Table
create table if not exists public.resources (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    url text not null,
    domain text not null,
    title text not null,
    description text,
    thumbnail_url text,
    favicon_url text,
    content_type text default 'website' check (content_type in ('website', 'youtube', 'article', 'tutorial', 'design', 'development', 'ai_tools', 'video', 'inspiration')),
    category_id uuid references public.categories(id) on delete set null,
    is_favorite boolean default false,
    is_read_later boolean default false,
    is_archived boolean default false,
    is_reviewed boolean default false,
    personal_notes text,
    view_count int default 0,
    last_opened_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Tasks Table
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
    status text default 'todo' check (status in ('todo', 'in_progress', 'completed')),
    due_date date,
    due_time text,
    category_id uuid references public.categories(id) on delete set null,
    goal_id uuid references public.goals(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
);

-- 7. Goals Table
create table if not exists public.goals (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    target_date date,
    progress int default 0 check (progress >= 0 and progress <= 100),
    status text default 'in_progress' check (status in ('not_started', 'in_progress', 'on_hold', 'completed')),
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.resources enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;

-- Policies for Authenticated User Isolation
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can access own categories" on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can access own collections" on public.collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can access own resources" on public.resources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can access own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can access own goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
