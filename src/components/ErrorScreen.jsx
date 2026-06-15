import { motion } from 'framer-motion'

export default function ErrorScreen({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6"
    >
      <span className="text-5xl mb-4" aria-hidden="true">
        ⚠️
      </span>
      <h2 className="text-xl font-bold text-text-primary mb-2">Erreur de connexion</h2>
      <p className="text-text-secondary text-center mb-8">
        Vérifie ta connexion internet et réessaie.
      </p>
      <button onClick={onRetry} className="btn-primary w-full max-w-xs">
        Réessayer
      </button>
    </motion.div>
  )
}
