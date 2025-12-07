-- Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Series Table
create table if not exists public.series (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(author_id, slug)
);

-- Add Series to Posts
alter table public.posts 
add column if not exists series_id uuid references public.series(id) on delete set null,
add column if not exists series_order integer;

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;
alter table public.series enable row level security;

-- Policies for Newsletter
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Authors can view subscribers"
  on public.newsletter_subscribers for select
  using (auth.uid() in (select id from public.profiles)); -- Simplified: any logged in user can see for now, ideally only admins

-- Policies for Series
create policy "Series are viewable by everyone"
  on public.series for select
  using (true);

create policy "Authors can create series"
  on public.series for insert
  with check (auth.uid() = author_id);

create policy "Authors can update their series"
  on public.series for update
  using (auth.uid() = author_id);

create policy "Authors can delete their series"
  on public.series for delete
  using (auth.uid() = author_id);

-- Search Function
create or replace function public.search_posts(search_query text)
returns setof public.posts as $$
  select *
  from public.posts
  where
    published = true
    and (
      to_tsvector('english', title || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
      @@ plainto_tsquery('english', search_query)
    )
  order by published_at desc;
$$ language sql stable;
