import { supabase } from './supabase'

async function deleteUserData(userId) {
  const tables = [
    { table: 'game_sessions', column: 'user_id' },
    { table: 'scores', column: 'user_id' },
    { table: 'daily_limits', column: 'user_id' },
    { table: 'profiles', column: 'id' },
  ]

  for (const { table, column } of tables) {
    const { error } = await supabase.from(table).delete().eq(column, userId)
    if (error && error.code !== '42P01') {
      throw error
    }
  }
}

async function deleteAuthUserViaEdgeFunction() {
  const { data, error } = await supabase.functions.invoke('delete-account')
  if (error) throw error
  if (data?.error) throw new Error(data.error)
}

async function deleteAuthUserViaRpc() {
  const { error } = await supabase.rpc('delete_user_account')
  if (error) throw error
}

export async function deleteAccount(userId) {
  await deleteUserData(userId)

  try {
    await deleteAuthUserViaEdgeFunction()
  } catch {
    await deleteAuthUserViaRpc()
  }

  await supabase.auth.signOut()
}
