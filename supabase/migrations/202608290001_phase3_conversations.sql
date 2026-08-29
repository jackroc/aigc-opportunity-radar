begin;

create table if not exists public.devices (
  id uuid primary key,
  installation_id text not null,
  account_user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint devices_installation_id_format check (
    installation_id ~ '^dvc_[0-9a-fA-F-]{36}$'
  )
);

create index if not exists devices_account_user_id_idx on public.devices(account_user_id);
create index if not exists devices_last_seen_at_idx on public.devices(last_seen_at desc);

create table if not exists public.conversation_threads (
  id uuid primary key,
  owner_device_id uuid not null references public.devices(id) on delete cascade,
  opportunity_type text not null default 'task',
  opportunity_id text not null,
  title text not null,
  provider text not null default 'rules',
  model text null,
  provider_thread_id text null,
  context_snapshot jsonb not null default '{}'::jsonb,
  last_message_preview text not null default '',
  message_count integer not null default 0,
  client_created_at timestamptz not null,
  client_updated_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversation_threads_opportunity_type_check check (opportunity_type in ('task', 'contest', 'general')),
  constraint conversation_threads_provider_check check (provider in ('rules', 'local-codex', 'platform', 'byok')),
  constraint conversation_threads_message_count_check check (message_count >= 0),
  constraint conversation_threads_title_length check (char_length(title) between 1 and 300)
);

create index if not exists conversation_threads_owner_updated_idx
  on public.conversation_threads(owner_device_id, client_updated_at desc);
create index if not exists conversation_threads_opportunity_idx
  on public.conversation_threads(opportunity_type, opportunity_id);

create table if not exists public.conversation_messages (
  id uuid primary key,
  thread_id uuid not null references public.conversation_threads(id) on delete cascade,
  owner_device_id uuid not null references public.devices(id) on delete cascade,
  role text not null,
  content text not null default '',
  provider text null,
  model text null,
  provider_thread_id text null,
  status text not null default 'completed',
  error_code text null,
  usage jsonb null,
  client_created_at timestamptz not null,
  client_updated_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversation_messages_role_check check (role in ('user', 'assistant', 'system')),
  constraint conversation_messages_provider_check check (provider is null or provider in ('rules', 'local-codex', 'platform', 'byok')),
  constraint conversation_messages_status_check check (status in ('pending', 'completed', 'failed')),
  constraint conversation_messages_content_length check (char_length(content) <= 32000)
);

create index if not exists conversation_messages_thread_created_idx
  on public.conversation_messages(thread_id, client_created_at asc);
create index if not exists conversation_messages_owner_created_idx
  on public.conversation_messages(owner_device_id, client_created_at desc);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.conversation_threads(id) on delete cascade,
  message_id uuid null references public.conversation_messages(id) on delete set null,
  owner_device_id uuid not null references public.devices(id) on delete cascade,
  provider text not null,
  model text null,
  request_id text null,
  status text not null,
  input_tokens integer null,
  output_tokens integer null,
  cached_input_tokens integer null,
  latency_ms integer null,
  error_code text null,
  created_at timestamptz not null default now(),
  constraint ai_runs_provider_check check (provider in ('rules', 'local-codex', 'platform', 'byok')),
  constraint ai_runs_status_check check (status in ('pending', 'completed', 'failed'))
);

create index if not exists ai_runs_owner_created_idx on public.ai_runs(owner_device_id, created_at desc);
create index if not exists ai_runs_owner_provider_created_idx
  on public.ai_runs(owner_device_id, provider, created_at desc);

create table if not exists public.provider_connections (
  id uuid primary key default gen_random_uuid(),
  owner_device_id uuid not null references public.devices(id) on delete cascade,
  provider text not null,
  base_url text null,
  model text null,
  secret_ref uuid null,
  key_hint text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_connections_provider_check check (provider in ('platform', 'byok')),
  constraint provider_connections_no_raw_secret check (
    key_hint is null or (char_length(key_hint) <= 24 and key_hint !~ '^sk-')
  )
);

create index if not exists provider_connections_owner_idx on public.provider_connections(owner_device_id);

alter table public.devices enable row level security;
alter table public.conversation_threads enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.ai_runs enable row level security;
alter table public.provider_connections enable row level security;

revoke all on table public.devices from anon, authenticated;
revoke all on table public.conversation_threads from anon, authenticated;
revoke all on table public.conversation_messages from anon, authenticated;
revoke all on table public.ai_runs from anon, authenticated;
revoke all on table public.provider_connections from anon, authenticated;

grant all on table public.devices to service_role;
grant all on table public.conversation_threads to service_role;
grant all on table public.conversation_messages to service_role;
grant all on table public.ai_runs to service_role;
grant all on table public.provider_connections to service_role;

commit;
