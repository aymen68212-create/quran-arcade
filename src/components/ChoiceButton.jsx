import { motion } from 'framer-motion'

const shakeAnimation = {
  x: [0, -6, 6, -6, 6, 0],
  transition: { duration: 0.4 },
}

export default function ChoiceButton({
  text,
  index,
  state,
  onClick,
  disabled,
}) {
  const baseClasses =
    'w-full text-left p-4 rounded-button border transition-all relative flex items-center justify-between'

  let stateClasses = 'bg-surface border-border hover:border-primary-green hover:bg-[#F0FDF9]'
  if (state === 'correct') {
    stateClasses = 'bg-[#DCFCE7] border-primary-green'
  } else if (state === 'wrong') {
    stateClasses = 'bg-[#FEE2E2] border-accent-red'
  } else if (state === 'reveal') {
    stateClasses = 'bg-[#DCFCE7] border-primary-green'
  } else if (disabled) {
    stateClasses = 'bg-surface border-border opacity-70'
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={
        state === 'wrong'
          ? { opacity: 1, y: 0, ...shakeAnimation }
          : { opacity: 1, y: 0 }
      }
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses}`}
    >
      <span className="arabic-text text-[20px] leading-relaxed flex-1" dir="rtl">
        {text}
      </span>
      {state === 'correct' && (
        <span className="text-primary-green font-bold text-lg ml-2 shrink-0">✓</span>
      )}
      {state === 'wrong' && (
        <span className="text-accent-red font-bold text-lg ml-2 shrink-0">✗</span>
      )}
      {state === 'reveal' && (
        <span className="text-primary-green font-bold text-lg ml-2 shrink-0">✓</span>
      )}
    </motion.button>
  )
}
