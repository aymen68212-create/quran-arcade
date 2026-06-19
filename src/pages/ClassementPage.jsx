import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useGameContext } from '../context/GameContext'
import { HIZB_BLOCKS } from '../data/hizbBlocks'
import { supabase } from '../services/supabase'

const RANK_COLORS = {
  1: '#F0C94A',
  2: '#C0C0C0',
  3: '#CD7F32',
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

function groupLeaderboard(rows) {
  const map = new Map()

  for (const row of rows) {
    const existing = map.get(row.user_id)
    const username = row.profiles?.username || row.profiles?.full_name || 'Joueur'
    if (existing) {
      existing.totalXp += row.xp_earned || 0
    } else {
      map.set(row.user_id, {
        userId: row.user_id,
        username,
        avatarUrl: row.profiles?.avatar_url,
        totalXp: row.xp_earned || 0,
      })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, 20)
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
  const rankColor = RANK_COLORS[rank]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 rounded-button px-4 py-3 min-h-[44px] ${
        isCurrentUser
          ? 'bg-[#FEF9E7] border-2 border-[#F0C94A]'
          : isPodium
            ? 'bg-white border border-[#E8F5EE] shadow-card'
            : 'bg-white border border-[#E8F5EE]'
      } ${isPodium ? 'py-4' : ''}`}
    >
      <span
        className={`font-bold shrink-0 w-8 text-center ${isPodium ? 'text-lg' : 'text-sm'}`}
        style={{ color: rankColor || '#6B7280' }}
      >
        {rank <= 3 ? (rank === 1 ? '👑' : rank) : rank}
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
  const { selectedHizbBlock, setSelectedHizbBlock } = useGameContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchLeaderboard() {
      setLoading(true)
      const { data } = await supabase
        .from('game_sessions')
        .select('user_id, xp_earned, profiles(username, full_name, avatar_url)')
        .eq('hizb_block', selectedHizbBlock.label)
        .order('xp_earned', { ascending: false })

      if (!cancelled) {
        setLeaderboard(groupLeaderboard(data || []))
        setLoading(false)
      }
    }

    fetchLeaderboard()
    return () => { cancelled = true }
  }, [selectedHizbBlock.label])

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="px-4 py-4 pb-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl" aria-hidden="true">👑</span>
        <h1 className="text-xl font-bold text-[#064E3B]">Classement</h1>
      </div>

      <div
        className="mb-5 rounded-button p-3"
        style={{ background: 'rgba(16, 185, 129, 0.04)' }}
      >
        <label className="block text-sm font-medium text-text-primary mb-2 pl-2 border-l-[3px] border-[#F0C94A]">
          Bloc Hizb
        </label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-surface border border-border rounded-button px-4 py-3 min-h-[44px] text-left text-sm flex items-center justify-between focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors"
          >
            <span className="truncate pr-2">{selectedHizbBlock.label}</span>
            <svg
              className={`w-5 h-5 text-primary-green shrink-0 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-button shadow-card max-h-60 overflow-y-auto">
              {HIZB_BLOCKS.map((block) => (
                <button
                  key={block.label}
                  onClick={() => {
                    setSelectedHizbBlock(block)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2.5 min-h-[44px] text-sm hover:bg-[#F0FDF9] transition-colors ${
                    selectedHizbBlock.label === block.label
                      ? 'text-primary-green font-medium bg-[#F0FDF9]'
                      : 'text-text-primary'
                  }`}
                >
                  {block.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-2 border-primary-green border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-secondary">Chargement du classement...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card-base p-8 text-center">
          <p className="text-text-secondary text-sm">
            Aucun joueur sur ce bloc encore. Sois le premier !
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
