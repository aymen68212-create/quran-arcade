import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', end: true, icon: '🎮', label: 'Challenges' },
  { to: '/classement', icon: '🏆', label: 'Classement' },
  { to: '/profil', icon: '👤', label: 'Profil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40 bg-white border-t border-[rgba(6,79,59,0.15)]">
      <div className="w-full flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 min-h-[44px] relative transition-colors ${
                isActive ? 'text-[#064E3B]' : 'text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl mb-0.5">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#F0C94A]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
