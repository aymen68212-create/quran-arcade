import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import DeleteAccountModal from '../components/DeleteAccountModal'

const CHALLENGE_LABELS = {
  x1: 'Le X-1',
  'next-ayah': 'Next Ayah',
  'next-page': 'Next Page',
}

const BADGE_DEFINITIONS = [
  { id: 'first_session', label: 'Première session', icon: '🎯' },
  { id: 'perfect', label: 'Score parfait', icon: '⭐' },
  { id: 'streak_7', label: '7 jours d\'affilée', icon: '🔥' },
]

function computeBadges(sessions, profile) {
  const earned = new Set(profile?.badges || [])

  if (sessions.length > 0) earned.add('first_session')
  if (sessions.some((s) => s.score === s.total_questions)) earned.add('perfect')
  if ((profile?.streak || 0) >= 7) earned.add('streak_7')

  return BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    unlocked: earned.has(badge.id),
  }))
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card-base p-4 text-center">
      <span className="text-xl block mb-1" aria-hidden="true">{icon}</span>
      <p className="text-2xl font-bold text-primary-green">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  )
}

function BadgeCard({ badge }) {
  return (
    <div
      className={`card-base p-3 text-center transition-opacity ${
        badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'
      }`}
    >
      <span className="text-2xl block mb-1">{badge.icon}</span>
      <p className="text-xs font-medium text-text-primary">{badge.label}</p>
    </div>
  )
}

export default function ProfilPage() {
  const navigate = useNavigate()
  const { user, profile, loading, openAuthModal, signOut, deleteAccount } = useAuth()
  const [sessions, setSessions] = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [stats, setStats] = useState({ sessionCount: 0, successRate: 0 })
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError('')

    const { error } = await deleteAccount()

    if (error) {
      setDeleteError(error.message || 'Impossible de supprimer le compte. Réessaie.')
      setDeleteLoading(false)
      return
    }

    setDeleteModalOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (!user) return

    async function fetchSessions() {
      setSessionsLoading(true)

      const [{ data: recent }, { count }, { data: allSessions }] = await Promise.all([
        supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('game_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('game_sessions')
          .select('score, total_questions')
          .eq('user_id', user.id),
      ])

      const correct = (allSessions || []).reduce((sum, s) => sum + (s.score || 0), 0)
      const total = (allSessions || []).reduce((sum, s) => sum + (s.total_questions || 0), 0)
      const successRate = total ? Math.round((correct / total) * 100) : 0

      setSessions(recent || [])
      setAllSessions(allSessions || [])
      setStats({ sessionCount: count || 0, successRate })
      setSessionsLoading(false)
    }

    fetchSessions()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <span className="text-4xl mb-4" aria-hidden="true">🌙</span>
        <p className="text-text-secondary mb-6">Connecte-toi pour voir ton profil</p>
        <button onClick={openAuthModal} className="btn-primary min-h-[44px] px-8">
          Se connecter
        </button>
      </div>
    )
  }

  const username =
    profile?.username ||
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Hafidh'

  const letter = username.charAt(0).toUpperCase()

  const badges = computeBadges(allSessions, profile)

  return (
    <div className="px-4 py-4 pb-6">
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-20 h-20 rounded-full bg-primary-green flex items-center justify-center text-3xl font-bold text-white mb-3"
          style={{ boxShadow: '0 0 0 3px #F0C94A' }}
        >
          {letter}
        </div>
        <h1 className="text-xl font-bold text-text-primary">{username}</h1>
        <p className="text-sm text-text-secondary">Hafidh</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="XP total" value={profile?.total_xp || 0} icon="⚡" />
        <StatCard label="Streak" value={profile?.streak || 0} icon="🔥" />
        <StatCard label="Taux réussite" value={`${stats.successRate}%`} icon="🎯" />
        <StatCard label="Sessions jouées" value={stats.sessionCount} icon="🎮" />
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold text-text-primary mb-3 pl-2 border-l-[3px] border-[#F0C94A]">
          Sessions récentes
        </h2>
        {sessionsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="card-base p-4 text-center text-sm text-text-secondary">
            Aucune session pour l'instant. Lance un défi !
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="card-base px-4 py-3 flex items-center justify-between min-h-[44px]"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {CHALLENGE_LABELS[session.challenge_type] || session.challenge_type}
                  </p>
                  <p className="text-xs text-text-secondary">{session.hizb_block}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-green">
                    {session.score}/{session.total_questions}
                  </p>
                  <span className="xp-badge text-[10px]">+{session.xp_earned} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold text-text-primary mb-3 pl-2 border-l-[3px] border-[#F0C94A]">
          Badges
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      <button
        onClick={signOut}
        className="btn-outline-red w-full min-h-[44px]"
      >
        Se déconnecter
      </button>

      <button
        onClick={() => {
          setDeleteError('')
          setDeleteModalOpen(true)
        }}
        className="btn-outline-red w-full min-h-[44px] mt-3"
      >
        Supprimer mon compte
      </button>

      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleteLoading) setDeleteModalOpen(false)
        }}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  )
}
