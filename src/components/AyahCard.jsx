import { motion } from 'framer-motion'

export default function AyahCard({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base border-l-4 border-l-primary-green p-5"
    >
      <p
        className="arabic-text text-[28px] leading-[2.2] text-center"
        dir="rtl"
      >
        {text}
      </p>
    </motion.div>
  )
}
