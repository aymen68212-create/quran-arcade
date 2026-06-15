import { createContext, useContext, useState, useCallback } from 'react'
import { getProfile } from '../services/localStorage'
import { HIZB_BLOCKS } from '../data/hizbBlocks'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [profile, setProfile] = useState(getProfile)
  const [selectedHizbBlock, setSelectedHizbBlock] = useState(HIZB_BLOCKS[0])

  const updateProfile = useCallback(() => {
    setProfile(getProfile())
  }, [])

  return (
    <GameContext.Provider
      value={{
        profile,
        selectedHizbBlock,
        setSelectedHizbBlock,
        updateProfile,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within GameProvider')
  return ctx
}
