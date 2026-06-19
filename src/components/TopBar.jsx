import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TopBar() {
  const { user, profile, openAuthModal, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const username =
    profile?.username ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'J'

  const letter = username.charAt(0).toUpperCase()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 bg-[#064E3B]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🌙
          </span>
          <span className="font-bold text-[#F0C94A] text-base">Quran Arcade</span>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="xp-badge flex items-center gap-1">
              ⚡ {profile?.total_xp || 0} XP
            </span>
            <span className="text-sm font-semibold text-white flex items-center gap-1">
              <span className="text-orange-400">🔥</span>
              {profile?.streak || 0}
            </span>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-11 h-11 rounded-full bg-primary-green flex items-center justify-center text-sm font-bold text-white border-2 border-[#F0C94A]/50"
                aria-label="Menu profil"
              >
                {letter}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-button border border-border shadow-card py-1 min-w-[160px] z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/profil')
                    }}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-text-primary hover:bg-[#F0FDF9] transition-colors"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      signOut()
                    }}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-accent-red hover:bg-red-50 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="text-sm font-semibold text-primary-green border-2 border-primary-green rounded-button px-4 py-2 min-h-[44px] bg-transparent hover:bg-white/10 transition-colors"
          >
            Connexion
          </button>
        )}
      </div>
    </header>
  )
}
