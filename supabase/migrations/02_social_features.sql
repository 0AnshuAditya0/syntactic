-- Comments Table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Post Likes Table
create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- Recipient
  actor_id uuid references public.profiles(id) on delete cascade not null, -- Who triggered it
  type text not null check (type in ('like', 'comment', 'reply')),
  resource_id uuid not null, -- ID of the post or comment
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Comments
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Post Likes
alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.post_likes for select
  using (true);

create policy "Authenticated users can toggle likes"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Authenticated users can remove likes"
  on public.post_likes for delete
  using (auth.uid() = user_id);

-- Notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications (mark as read)"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Triggers for Notifications

-- Function to handle new comment notification
create or replace function public.handle_new_comment()
returns trigger as $$
begin
  -- Notify post author (if not self)
  if (select author_id from public.posts where id = new.post_id) != new.user_id then
    insert into public.notifications (user_id, actor_id, type, resource_id)
    values (
      (select author_id from public.posts where id = new.post_id),
      new.user_id,
      'comment',
      new.post_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for comments
create trigger on_comment_created
  after insert on public.comments
  for each row execute procedure public.handle_new_comment();

-- Function to handle new like notification
create or replace function public.handle_new_like()
returns trigger as $$
begin
  -- Notify post author (if not self)
  if (select author_id from public.posts where id = new.post_id) != new.user_id then
    insert into public.notifications (user_id, actor_id, type, resource_id)
    values (
      (select author_id from public.posts where id = new.post_id),
      new.user_id,
      'like',
      new.post_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for likes
create trigger on_like_created
  after insert on public.post_likes
  for each row execute procedure public.handle_new_like();
