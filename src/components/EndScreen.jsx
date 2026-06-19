import { motion } from 'framer-motion'

function Star({ filled }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill={filled ? '#F0C94A' : 'none'}
      stroke="#F0C94A"
      strokeWidth="1.5"
      className="drop-shadow-sm"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function getStars(score, total = 10) {
  if (score >= total * 0.8) return 3
  if (score >= total * 0.5) return 2
  return 1
}

function getMessage(score, total = 10) {
  const ratio = score / total
  if (ratio >= 0.8) return 'ممتاز ! Excellent travail !'
  if (ratio >= 0.5) return 'جيد ! Continue ainsi !'
  return 'تدرب ! Rejoue pour progresser !'
}

export default function EndScreen({
  title,
  score,
  totalQuestions = 10,
  xpEarned,
  onReplay,
  onChangeBlock,
  showLoginBanner,
  onLogin,
}) {
  const stars = getStars(score, totalQuestions)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="card-base p-6 text-center mx-4"
    >
      {title && (
        <p className="text-sm font-semibold text-text-secondary mb-3">{title}</p>
      )}
      <p className="text-5xl font-bold text-primary-green mb-2">
        {score} / {totalQuestions}
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <Star key={i} filled={i <= stars} />
        ))}
      </div>

      <span className="xp-badge text-sm px-4 py-1.5 inline-block mb-4">
        +{xpEarned} XP gagnés
      </span>

      {showLoginBanner && (
        <div className="bg-[#F0FDF9] border border-[#E8F5EE] rounded-button p-3 mb-4 text-left">
          <p className="text-xs text-text-secondary mb-2">
            Connecte-toi pour sauvegarder tes progrès et apparaître au classement
          </p>
          <button onClick={onLogin} className="btn-primary w-full min-h-[44px] text-sm">
            Se connecter
          </button>
        </div>
      )}

      <p className="arabic-text text-lg text-text-arabic mb-6">{getMessage(score, totalQuestions)}</p>

      <div className="flex flex-col gap-3">
        <button onClick={onReplay} className="btn-outline w-full">
          Rejouer
        </button>
        <button onClick={onChangeBlock} className="btn-primary w-full">
          Changer de bloc
        </button>
      </div>
    </motion.div>
  )
}
