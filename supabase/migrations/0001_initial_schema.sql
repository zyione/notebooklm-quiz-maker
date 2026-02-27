-- ============================================================
-- NotebookLM Quiz Maker — Initial Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Documents table (stores metadata about each uploaded PDF)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  storage_path text not null,
  created_at timestamptz default now() not null
);

-- 2. Flashcards table (stores generated Q&A pairs)
create table if not exists public.flashcards (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  front text not null,
  back text not null,
  created_at timestamptz default now() not null
);

-- 3. Enable Row Level Security
alter table public.documents enable row level security;
alter table public.flashcards enable row level security;

-- 4. RLS Policies — users can only CRUD their own rows
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

create policy "Users can view own flashcards"
  on public.flashcards for select
  using (auth.uid() = user_id);

create policy "Users can insert own flashcards"
  on public.flashcards for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own flashcards"
  on public.flashcards for delete
  using (auth.uid() = user_id);

-- 5. Storage bucket for PDFs (run in SQL editor or create via Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', false);
-- NOTE: It's easier to create the 'pdfs' bucket via the Supabase Dashboard > Storage.
-- Then add a policy: "Authenticated users can upload to their own folder"
--   Policy: (bucket_id = 'pdfs') AND (auth.uid()::text = (storage.foldername(name))[1])
