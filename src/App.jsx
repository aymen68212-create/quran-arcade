import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider } from './context/GameContext'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import ChallengesPage from './pages/ChallengesPage'
import GameScreen from './pages/GameScreen'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<ChallengesPage />} />
          <Route path="/challenge" element={<GameScreen />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  const isChallenge = location.pathname === '/challenge'

  return (
    <GameProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen relative"
      >
        {!isChallenge && <TopBar />}
        <main className={isChallenge ? 'pb-0' : 'pb-20'}>
          <AnimatedRoutes />
        </main>
        {!isChallenge && <BottomNav />}
      </motion.div>
    </GameProvider>
  )
}
