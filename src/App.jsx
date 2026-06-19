import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import AuthModal from './components/AuthModal'
import ChallengesPage from './pages/ChallengesPage'
import ClassementPage from './pages/ClassementPage'
import ProfilPage from './pages/ProfilPage'
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
          <Route path="/classement" element={<ClassementPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/challenge" element={<GameScreen />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppContent() {
  const location = useLocation()
  const isChallenge = location.pathname === '/challenge'

  return (
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
      <AuthModal />
    </motion.div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  )
}
