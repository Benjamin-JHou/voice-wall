create table if not exists public.shared_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  theme text not null,
  duration integer not null check (duration >= 1 and duration <= 60),
  audio_url text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.shared_notes enable row level security;

create policy "Public can read shared voice notes"
  on public.shared_notes
  for select
  using (expires_at is null or expires_at > now());

create policy "Anyone can create shared voice notes"
  on public.shared_notes
  for insert
  with check (duration >= 1 and duration <= 60);

insert into storage.buckets (id, name, public)
values ('voice-notes', 'voice-notes', true)
on conflict (id) do update set public = excluded.public;

create policy "Anyone can upload voice notes"
  on storage.objects
  for insert
  with check (bucket_id = 'voice-notes');

create policy "Public can read voice notes"
  on storage.objects
  for select
  using (bucket_id = 'voice-notes');
