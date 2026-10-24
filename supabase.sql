-- 在你自己的 Supabase SQL Editor 中运行一次。无需开启 Auth，也无需用户注册。
-- 表不直接开放；所有读写均校验不可猜测的共享空间密钥。
begin;
create table if not exists public.trip_boards (
 token_hash text primary key,
 data jsonb not null,
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.trip_boards enable row level security;
revoke all on public.trip_boards from anon, authenticated;
create or replace function public.trip_read(room_token text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if room_token is null or room_token !~ '^[A-Za-z0-9_-]{32,128}$' then raise exception 'Invalid room token'; end if;
 select jsonb_build_object('data',b.data,'revision',b.revision)
 into result from public.trip_boards b
 where b.token_hash=encode(sha256(convert_to(room_token,'UTF8')),'hex');
 return result;
end;$$;
create or replace function public.trip_write(room_token text,expected_revision bigint,new_data jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare h text; next_revision bigint;
begin
 if room_token is null or room_token !~ '^[A-Za-z0-9_-]{32,128}$' then raise exception 'Invalid room token'; end if;
 if new_data is null or jsonb_typeof(new_data) <> 'object' or octet_length(new_data::text)>1000000
 or jsonb_typeof(new_data->'plans') is distinct from 'array' then raise exception 'Invalid board'; end if;
 if jsonb_array_length(new_data->'plans')>100 then raise exception 'Too many plans'; end if;
 if expected_revision is null or expected_revision<0 then raise exception 'Invalid revision'; end if;
 h:=encode(sha256(convert_to(room_token,'UTF8')),'hex');
 if expected_revision=0 then
   insert into public.trip_boards(token_hash,data) values(h,new_data)
   on conflict(token_hash) do nothing returning revision into next_revision;
 else
   update public.trip_boards set data=new_data,revision=revision+1,updated_at=now()
   where token_hash=h and revision=expected_revision returning revision into next_revision;
 end if;
 if next_revision is null then return jsonb_build_object('conflict',true); end if;
 return jsonb_build_object('revision',next_revision);
end;$$;
revoke all on function public.trip_read(text) from public, anon, authenticated;
revoke all on function public.trip_write(text,bigint,jsonb) from public, anon, authenticated;
grant execute on function public.trip_read(text) to anon;
grant execute on function public.trip_write(text,bigint,jsonb) to anon;
commit;
