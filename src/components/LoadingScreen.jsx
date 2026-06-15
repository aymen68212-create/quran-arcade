import { motion } from 'framer-motion'

export default function LoadingScreen({ progress, loadingText = 'Chargement des versets...' }) {
  const showProgress = progress && progress.total > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-surface flex flex-col items-center justify-center px-6"
    >
      <div className="text-5xl text-primary-green animate-crescent mb-6" aria-hidden="true">
        🌙
      </div>
      <p className="arabic-text text-xl text-primary-green mb-2">
        جارٍ تحميل الآيات...
      </p>
      <p className="text-sm text-text-secondary">
        {showProgress
          ? `${loadingText} ${progress.current} / ${progress.total}`
          : loadingText}
      </p>
    </motion.div>
  )
}
