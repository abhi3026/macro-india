
-- Enums
create type public.app_role as enum ('admin', 'editor', 'analyst', 'contributor');
create type public.content_status as enum ('draft', 'pending', 'approved', 'published', 'declined');
create type public.weekly_section as enum ('Policy', 'Market', 'Risk');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- can_manage: admin or editor
create or replace function public.can_manage(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

-- Auto-create profile + bootstrap admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));

  if lower(new.email) = 'abhigourav13@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'contributor')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Educational posts
create table public.educational_posts (
  id uuid primary key default gen_random_uuid(),
  serial bigserial not null,
  title text not null,
  slug text not null unique,
  category text,
  excerpt text,
  body text,
  image text,
  status content_status not null default 'draft',
  seo_title text,
  seo_description text,
  og_image text,
  canonical_url text,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.educational_posts enable row level security;
create trigger educational_posts_touch before update on public.educational_posts
for each row execute function public.touch_updated_at();

-- Research articles
create table public.research_articles (
  id uuid primary key default gen_random_uuid(),
  serial bigserial not null,
  title text not null,
  slug text not null unique,
  category text,
  excerpt text,
  body text,
  featured_image text,
  tags text[] not null default '{}',
  references_list text[] not null default '{}',
  publish_date date,
  status content_status not null default 'draft',
  seo_title text,
  seo_description text,
  og_image text,
  canonical_url text,
  featured boolean not null default false,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.research_articles enable row level security;
create trigger research_articles_touch before update on public.research_articles
for each row execute function public.touch_updated_at();

-- Economic indicators
create table public.economic_indicators (
  id uuid primary key default gen_random_uuid(),
  serial bigserial not null,
  indicator text not null,
  current_value text,
  previous_value text,
  unit text,
  source text,
  source_url text,
  last_updated timestamptz not null default now(),
  status content_status not null default 'published',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.economic_indicators enable row level security;
create trigger economic_indicators_touch before update on public.economic_indicators
for each row execute function public.touch_updated_at();

-- Weekly reads
create table public.weekly_reads (
  id uuid primary key default gen_random_uuid(),
  serial bigserial not null,
  section weekly_section not null,
  heading text not null,
  body text,
  image text,
  link_url text,
  status content_status not null default 'draft',
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.weekly_reads enable row level security;
create trigger weekly_reads_touch before update on public.weekly_reads
for each row execute function public.touch_updated_at();

-- Invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role app_role not null,
  invited_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.invitations enable row level security;

-- ============== RLS POLICIES ==============

-- profiles
create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid());

-- user_roles
create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- helper macro pattern for content tables
-- educational_posts
create policy "public read published edu" on public.educational_posts for select using (status = 'published');
create policy "auth read all edu" on public.educational_posts for select to authenticated
  using (public.can_manage(auth.uid()) or author_id = auth.uid());
create policy "auth insert edu" on public.educational_posts for insert to authenticated
  with check (auth.uid() is not null and (author_id = auth.uid() or public.can_manage(auth.uid())));
create policy "manage update edu" on public.educational_posts for update to authenticated
  using (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')))
  with check (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')));
create policy "manage delete edu" on public.educational_posts for delete to authenticated
  using (public.can_manage(auth.uid()));

-- research_articles
create policy "public read published research" on public.research_articles for select using (status = 'published');
create policy "auth read all research" on public.research_articles for select to authenticated
  using (public.can_manage(auth.uid()) or author_id = auth.uid());
create policy "auth insert research" on public.research_articles for insert to authenticated
  with check (auth.uid() is not null and (author_id = auth.uid() or public.can_manage(auth.uid())));
create policy "manage update research" on public.research_articles for update to authenticated
  using (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')))
  with check (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')));
create policy "manage delete research" on public.research_articles for delete to authenticated
  using (public.can_manage(auth.uid()));

-- economic_indicators
create policy "public read published indicators" on public.economic_indicators for select using (status = 'published');
create policy "auth read all indicators" on public.economic_indicators for select to authenticated
  using (public.can_manage(auth.uid()));
create policy "manage write indicators" on public.economic_indicators for all to authenticated
  using (public.can_manage(auth.uid())) with check (public.can_manage(auth.uid()));

-- weekly_reads
create policy "public read published weekly" on public.weekly_reads for select using (status = 'published');
create policy "auth read all weekly" on public.weekly_reads for select to authenticated
  using (public.can_manage(auth.uid()) or author_id = auth.uid());
create policy "auth insert weekly" on public.weekly_reads for insert to authenticated
  with check (auth.uid() is not null and (author_id = auth.uid() or public.can_manage(auth.uid())));
create policy "manage update weekly" on public.weekly_reads for update to authenticated
  using (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')))
  with check (public.can_manage(auth.uid()) or (author_id = auth.uid() and status in ('draft','pending','declined')));
create policy "manage delete weekly" on public.weekly_reads for delete to authenticated
  using (public.can_manage(auth.uid()));

-- invitations
create policy "admins manage invitations" on public.invitations for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Storage bucket
insert into storage.buckets (id, name, public) values ('cms-media','cms-media', true)
on conflict (id) do nothing;

create policy "public read cms-media" on storage.objects for select using (bucket_id = 'cms-media');
create policy "auth upload cms-media" on storage.objects for insert to authenticated
  with check (bucket_id = 'cms-media');
create policy "owners update cms-media" on storage.objects for update to authenticated
  using (bucket_id = 'cms-media' and owner = auth.uid());
create policy "managers delete cms-media" on storage.objects for delete to authenticated
  using (bucket_id = 'cms-media' and (owner = auth.uid() or public.can_manage(auth.uid())));
