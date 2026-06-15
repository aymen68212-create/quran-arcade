import { useGameContext } from '../context/GameContext'

export default function TopBar() {
  const { profile } = useGameContext()

  return (
    <header className="sticky top-0 z-40 bg-[#064E3B]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🌙
          </span>
          <span className="font-bold text-[#F0C94A] text-base">Quran Arcade</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="xp-badge flex items-center gap-1">
            ⚡ {profile.totalXP} XP
          </span>
          <span className="text-sm font-semibold text-white flex items-center gap-1">
            <span className="text-orange-400">🔥</span>
            {profile.streak}
          </span>
        </div>
      </div>
    </header>
  )
}
