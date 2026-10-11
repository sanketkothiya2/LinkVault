-- LinkVault Complete PostgreSQL Schema for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Categories Table
create table if not exists public.categories (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    slug text not null,
    color text default '#6366f1',
    icon text default 'folder',
    description text,
    display_order int default 0,
    item_count int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Resources Table
create table if not exists public.resources (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    url text not null,
    domain text not null,
    title text not null,
    description text,
    thumbnail_url text,
    favicon_url text,
    content_type text default 'website',
    category_id text references public.categories(id) on delete set null,
    tags jsonb default '[]'::jsonb,
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

-- 4. Tasks Table
create table if not exists public.tasks (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    description text,
    priority text default 'medium',
    status text default 'todo',
    due_date text,
    due_time text,
    category_id text references public.categories(id) on delete set null,
    goal_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
);

-- 5. Goals Table
create table if not exists public.goals (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    description text,
    target_date text,
    progress int default 0,
    status text default 'in_progress',
    image_url text,
    milestones jsonb default '[]'::jsonb,
    linked_resource_ids jsonb default '[]'::jsonb,
    linked_task_ids jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. User Profiles Table
create table if not exists public.profiles (
    id text primary key,
    email text not null,
    full_name text default 'Sanket Kothiya',
    avatar_url text,
    theme_preference text default 'dark',
    daily_quote text default 'Collect what inspires you, Build what you dream.',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Grant access to API roles
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- 8. Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.profiles enable row level security;

-- 9. RLS Policies (Allow access to own rows or public demo data)
drop policy if exists "Categories access policy" on public.categories;
create policy "Categories access policy" on public.categories for all
using (user_id is null or (select auth.uid()) = user_id or auth.uid() is null)
with check (user_id is null or (select auth.uid()) = user_id or auth.uid() is null);

drop policy if exists "Resources access policy" on public.resources;
create policy "Resources access policy" on public.resources for all
using (user_id is null or (select auth.uid()) = user_id or auth.uid() is null)
with check (user_id is null or (select auth.uid()) = user_id or auth.uid() is null);

drop policy if exists "Tasks access policy" on public.tasks;
create policy "Tasks access policy" on public.tasks for all
using (user_id is null or (select auth.uid()) = user_id or auth.uid() is null)
with check (user_id is null or (select auth.uid()) = user_id or auth.uid() is null);

drop policy if exists "Goals access policy" on public.goals;
create policy "Goals access policy" on public.goals for all
using (user_id is null or (select auth.uid()) = user_id or auth.uid() is null)
with check (user_id is null or (select auth.uid()) = user_id or auth.uid() is null);

drop policy if exists "Profiles access policy" on public.profiles;
create policy "Profiles access policy" on public.profiles for all
using (true)
with check (true);

-- 10. Seed Default Categories if not exists
insert into public.categories (id, name, slug, color, display_order, item_count) values
('cat-anim', 'Animation & Motion', 'animation-motion', '#F97316', 1, 24),
('cat-3d', '3D Websites & Three.js', '3d-websites', '#06B6D4', 2, 18),
('cat-uiux', 'UI/UX Design', 'ui-ux-design', '#EC4899', 3, 32),
('cat-web', 'Web Design Inspiration', 'web-design-inspiration', '#10B981', 4, 27),
('cat-front', 'Frontend Development', 'frontend-development', '#3B82F6', 5, 45),
('cat-back', 'Backend Development', 'backend-development', '#EF4444', 6, 22),
('cat-ai', 'AI Tools', 'ai-tools', '#8B5CF6', 7, 16),
('cat-tut', 'Tutorials & Courses', 'tutorials-courses', '#F59E0B', 8, 30),
('cat-yt', 'YouTube Resources', 'youtube-resources', '#E11D48', 9, 28),
('cat-art', 'Articles & Blogs', 'articles-blogs', '#D946EF', 10, 19),
('cat-creative', 'Creative Coding', 'creative-coding', '#14B8A6', 11, 12),
('cat-typo', 'Typography & Fonts', 'typography-fonts', '#6366F1', 12, 15),
('cat-icons', 'Icons & Illustrations', 'icons-illustrations', '#A855F7', 13, 14),
('cat-port', 'Portfolio Inspiration', 'portfolio-inspiration', '#0EA5E9', 14, 21),
('cat-biz', 'Business & Productivity', 'business-productivity', '#64748B', 15, 9),
('cat-movie', 'Movies & Entertainment', 'movies-entertainment', '#F43F5E', 16, 11),
('cat-read', 'Read Later', 'read-later', '#84CC16', 17, 8),
('cat-uncat', 'Uncategorized', 'uncategorized', '#94A3B8', 18, 5)
on conflict (id) do nothing;
