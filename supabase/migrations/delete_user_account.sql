-- Run this in the Supabase SQL Editor (fallback if Edge Function is not deployed)
-- Grants authenticated users the ability to delete their own auth record after data cleanup

create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.game_sessions where user_id = uid;
  delete from public.scores where user_id = uid;
  delete from public.daily_limits where user_id = uid;
  delete from public.profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_user_account() from public;
grant execute on function public.delete_user_account() to authenticated;
