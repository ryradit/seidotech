create table public.comments (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    post_slug text not null references posts(slug) on delete cascade,
    content text not null,
    author_name text not null,
    author_email text not null,
    constraint comments_pkey primary key (id)
);

-- Enable RLS
alter table public.comments enable row level security;

-- Create policy to allow anyone to read comments
create policy "Anyone can read comments"
on public.comments for select
to anon
using (true);

-- Create policy to allow anyone to insert comments
create policy "Anyone can insert comments"
on public.comments for insert
to anon
with check (true);

-- Create index on post_slug for faster queries
create index comments_post_slug_idx on public.comments(post_slug);

-- Create index on created_at for faster sorting
create index comments_created_at_idx on public.comments(created_at);
