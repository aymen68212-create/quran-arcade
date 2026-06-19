import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'

const RANK_DISPLAY = {
  1: { icon: '👑', color: '#F0C94A' },
  2: { icon: '🥈', color: '#C0C0C0' },
  3: { icon: '🥉', color: '#CD7F32' },
}

const AVATAR_COLORS = [
  '#10B981',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
]

function getAvatarColor(name) {
  const code = (name || 'J').charCodeAt(0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

function PlayerAvatar({ name, size = 'md' }) {
  const letter = (name || 'J').charAt(0).toUpperCase()
  const color = getAvatarColor(name)
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base'

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {letter}
    </div>
  )
}

function LeaderboardRow({ player, rank, isCurrentUser, isPodium }) {
  const rankInfo = RANK_DISPLAY[rank]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 rounded-button px-4 py-3 min-h-[44px] ${
        isCurrentUser
          ? 'bg-[#FEF9E7] border-2 border-[#F0C94A]'
          : rank === 1
            ? 'bg-[#FEF9E7] border border-[#F0C94A] shadow-card'
            : isPodium
              ? 'bg-white border border-[#E8F5EE] shadow-card'
              : 'bg-white border border-[#E8F5EE]'
      } ${isPodium ? 'py-4' : ''}`}
    >
      <span
        className={`font-bold shrink-0 w-8 text-center ${isPodium ? 'text-lg' : 'text-sm'}`}
        style={{ color: rankInfo?.color || '#6B7280' }}
      >
        {rankInfo ? rankInfo.icon : rank}
      </span>
      <PlayerAvatar name={player.username} size={isPodium ? 'lg' : 'md'} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-text-primary truncate ${isPodium ? 'text-base' : 'text-sm'}`}>
          {player.username}
          {isCurrentUser && (
            <span className="ml-1 text-xs text-[#F0C94A] font-medium">(toi)</span>
          )}
        </p>
      </div>
      <span className="xp-badge shrink-0">{player.totalXp} XP</span>
    </motion.div>
  )
}

export default function ClassementPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchLeaderboard() {
      setLoading(true)
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_xp')
        .order('total_xp', { ascending: false })
        .limit(20)

      if (!cancelled) {
        setLeaderboard(
          (data || []).map((row) => ({
            userId: row.id,
            username: row.username || 'Joueur',
            avatarUrl: row.avatar_url,
            totalXp: row.total_xp || 0,
          }))
        )
        setLoading(false)
      }
    }

    fetchLeaderboard()
    return () => { cancelled = true }
  }, [])

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="px-4 py-4 pb-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#064E3B]">🏆 Classement Global</h1>
        <p className="text-sm text-text-secondary mt-1">
          Classement basé sur le total XP gagné
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-2 border-primary-green border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-secondary">Chargement du classement...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card-base p-8 text-center">
          <p className="text-text-secondary text-sm">
            Aucun joueur encore. Sois le premier !
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {top3.length > 0 && (
            <div className="flex flex-col gap-3 mb-2">
              {top3.map((player, i) => (
                <LeaderboardRow
                  key={player.userId}
                  player={player}
                  rank={i + 1}
                  isCurrentUser={user?.id === player.userId}
                  isPodium
                />
              ))}
            </div>
          )}
          {rest.map((player, i) => (
            <LeaderboardRow
              key={player.userId}
              player={player}
              rank={i + 4}
              isCurrentUser={user?.id === player.userId}
              isPodium={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
