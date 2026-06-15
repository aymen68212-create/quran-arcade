import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameContext } from '../context/GameContext'
import { HIZB_BLOCKS } from '../data/hizbBlocks'
import BismillahHero from '../components/BismillahHero'
import OrnamentalDivider from '../components/OrnamentalDivider'

const cardThemes = {
  green: {
    border: 'border-l-primary-green',
    topLine: 'bg-primary-green',
    iconBg: 'bg-[#DCFCE7]',
    xp: '+75 XP',
    difficulty: 'Avancé',
    pill: 'text-primary-green border-primary-green',
    btn: 'btn-primary',
  },
  blue: {
    border: 'border-l-[#3B82F6]',
    topLine: 'bg-[#3B82F6]',
    iconBg: 'bg-[#DBEAFE]',
    xp: '+25 XP',
    difficulty: 'Facile',
    pill: 'text-[#3B82F6] border-[#3B82F6]',
    btn: 'btn-blue',
  },
  amber: {
    border: 'border-l-[#F59E0B]',
    topLine: 'bg-[#F59E0B]',
    iconBg: 'bg-[#FEF3C7]',
    xp: '+50 XP',
    difficulty: 'Moyen',
    pill: 'text-[#F59E0B] border-[#F59E0B]',
    btn: 'btn-amber',
  },
}

function ExerciseCard({ exercise, index, onStart }) {
  const theme = cardThemes[exercise.theme || 'green']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}
      whileTap={{ scale: 0.98 }}
      className={`card-base border-l-4 ${theme.border} overflow-hidden hover:shadow-card-hover transition-shadow relative`}
    >
      <div className={`h-1 w-full ${theme.topLine}`} />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center text-lg shrink-0`}
          >
            {exercise.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-text-primary">{exercise.title}</h3>
              <span className="xp-badge shrink-0">{theme.xp}</span>
            </div>
            <p className="text-sm text-text-secondary mb-2">{exercise.subtitle}</p>
            <span
              className={`inline-block text-xs font-medium border rounded-pill px-2 py-0.5 ${theme.pill}`}
            >
              {theme.difficulty}
            </span>
          </div>
        </div>
        <button onClick={onStart} className={`${theme.btn} w-full`}>
          Commencer →
        </button>
      </div>
    </motion.div>
  )
}

function QuranFooter() {
  return (
    <div className="px-4 pt-6 pb-2 text-center">
      <div className="max-w-[200px] mx-auto h-px bg-[#DC2626]/40 mb-3" />
      <p className="font-arabic text-lg text-[#064E3B] leading-relaxed" dir="rtl">
        وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
      </p>
      <div className="max-w-[200px] mx-auto h-px bg-[#DC2626]/40 mt-3" />
    </div>
  )
}

export default function ChallengesPage() {
  const navigate = useNavigate()
  const { selectedHizbBlock, setSelectedHizbBlock } = useGameContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const startChallenge = (challengeType) => {
    navigate('/challenge', {
      state: { challengeType, hizbBlock: selectedHizbBlock },
    })
  }

  const exercises = [
    {
      theme: 'green',
      icon: '🔙',
      title: 'Le X-1',
      subtitle: 'Trouve le verset précédent',
      challengeType: 'x1',
    },
    {
      theme: 'blue',
      icon: '➡️',
      title: 'Next Ayah',
      subtitle: 'Trouve le verset suivant',
      challengeType: 'next-ayah',
    },
    {
      theme: 'amber',
      icon: '📄',
      title: 'Next Page',
      subtitle: 'Trouve le 1er verset de la page suivante',
      challengeType: 'next-page',
    },
  ]

  return (
    <div className="relative pb-4 min-h-full">
      <div className="relative z-10">
        <BismillahHero />

        <OrnamentalDivider />

        <div
          className="mx-4 mb-5 rounded-button p-3"
          style={{ background: 'rgba(16, 185, 129, 0.04)' }}
        >
          <label className="block text-sm font-medium text-text-primary mb-2 pl-2 border-l-[3px] border-[#F0C94A]">
            Zone de révision
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-surface border border-border rounded-button px-4 py-3 text-left text-sm flex items-center justify-between focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F0FDF9] transition-colors ${
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

        <div className="gold-divider mx-4 mb-5" />

        <div className="px-4 flex flex-col gap-4">
          {exercises.map((exercise, i) => (
            <ExerciseCard
              key={exercise.title}
              index={i}
              exercise={exercise}
              onStart={() => startChallenge(exercise.challengeType)}
            />
          ))}
        </div>

        <QuranFooter />
      </div>
    </div>
  )
}
