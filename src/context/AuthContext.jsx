import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { deleteAccount as deleteAccountService } from '../services/deleteAccount'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signInWithEmail(email, password) {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function signUpWithEmail(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: username } },
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function deleteAccount() {
    if (!user) return { error: new Error('Non connecté') }

    try {
      await deleteAccountService(user.id)
      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function updateXP(xpEarned, sessionData) {
    if (!user) return

    await supabase.from('game_sessions').insert({
      user_id: user.id,
      challenge_type: sessionData.challengeType,
      hizb_block: sessionData.hizbBlock,
      hizb_start: sessionData.hizbStart,
      hizb_end: sessionData.hizbEnd,
      score: sessionData.score,
      total_questions: sessionData.totalQuestions,
      xp_earned: xpEarned,
    })

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const newStreak =
      profile?.last_played_at === yesterday
        ? (profile.streak || 0) + 1
        : profile?.last_played_at === today
          ? profile.streak
          : 1

    const { data } = await supabase
      .from('profiles')
      .update({
        total_xp: (profile?.total_xp || 0) + xpEarned,
        streak: newStreak,
        last_played_at: today,
      })
      .eq('id', user.id)
      .select()
      .single()

    setProfile(data)
  }

  const openAuthModal = () => setAuthModalOpen(true)
  const closeAuthModal = () => setAuthModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        deleteAccount,
        updateXP,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
