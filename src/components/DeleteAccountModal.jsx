import { motion, AnimatePresence } from 'framer-motion'

export default function DeleteAccountModal({ open, onClose, onConfirm, loading, error }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6, 79, 59, 0.85)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-[20px] w-full max-w-[380px] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[#064E3B] mb-3">Supprimer le compte</h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Es-tu sûr ? Cette action est irréversible. Toutes tes données seront
              définitivement supprimées.
            </p>

            {error && (
              <p className="text-sm text-accent-red text-center mb-4">{error}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="btn-danger w-full min-h-[44px] disabled:opacity-60"
              >
                {loading ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-grey w-full min-h-[44px] disabled:opacity-60"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
