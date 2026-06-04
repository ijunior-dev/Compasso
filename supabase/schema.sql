-- Tabela de licenças do Compasso
create table if not exists licenses (
  id                  uuid primary key default gen_random_uuid(),
  key                 text not null unique,
  status              text not null default 'pending' check (status in ('pending','active','revoked')),
  email               text,
  hotmart_transaction text,
  activated_at        timestamptz,
  created_at          timestamptz not null default now()
);

-- Index para busca rápida pela chave
create index if not exists licenses_key_idx on licenses(key);

-- Habilita Row Level Security (RLS) — o acesso só ocorre via service_role (server)
alter table licenses enable row level security;

-- Nenhuma política pública: só o backend (service_role key) acessa
