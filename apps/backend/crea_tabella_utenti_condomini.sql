create table if not exists utenti_condomini (
  id uuid primary key default uuid_generate_v4(),
  id_condominio uuid not null,
  codice_fiscale_anagrafica varchar(16) not null,
  created_at timestamp default now()
);
