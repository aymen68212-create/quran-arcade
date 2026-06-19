import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameContext } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import { useChallenge } from '../hooks/useChallenge'
import { useTimer, getTimeForQuestion } from '../hooks/useTimer'
import { saveSessionResult } from '../services/localStorage'
import LoadingScreen from '../components/LoadingScreen'
import ErrorScreen from '../components/ErrorScreen'
import ProgressDots from '../components/ProgressDots'
import TimerBar from '../components/TimerBar'
import AyahCard from '../components/AyahCard'
import ChoiceButton from '../components/ChoiceButton'
import EndScreen from '../components/EndScreen'

const CHALLENGE_CONFIG = {
  x1: {
    xpPerCorrect: 7,
    xpBonusComplete: 5,
    questionLabel: 'Quel est le verset précédent ?',
    endTitle: 'X-1 · Session terminée',
    pillClass: 'text-primary-green bg-[#DCFCE7]',
    difficulty: 'Avancé',
    loadingText: 'Chargement...',
  },
  'next-ayah': {
    xpBonusComplete: 0,
    questionLabel: 'Quel est le verset suivant ?',
    endTitle: 'Next Ayah · Session terminée',
    pillClass: 'text-[#3B82F6] bg-[#DBEAFE]',
    difficulty: 'Facile',
    loadingText: 'Chargement...',
  },
  'next-page': {
    xpPerCorrect: 5,
    xpBonusComplete: 0,
    questionLabel: 'Quel est le 1er verset de la page suivante ?',
    endTitle: 'Next Page · Session terminée',
    pillClass: 'text-[#F59E0B] bg-[#FEF3C7]',
    difficulty: 'Moyen',
    loadingText: 'Chargement des pages...',
  },
}

function getXpForCorrect(challengeType, questionIndex) {
  if (challengeType === 'next-ayah') {
    return questionIndex % 2 === 0 ? 3 : 2
  }
  return CHALLENGE_CONFIG[challengeType]?.xpPerCorrect ?? 7
}

function getDifficultyClass(challengeType) {
  switch (challengeType) {
    case 'next-ayah':
      return 'text-[#3B82F6] border-[#3B82F6]'
    case 'next-page':
      return 'text-[#F59E0B] border-[#F59E0B]'
    default:
      return 'text-primary-green border-primary-green'
  }
}

export default function GameScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedHizbBlock, updateProfile } = useGameContext()
  const { user, updateXP, openAuthModal } = useAuth()

  const challengeType = location.state?.challengeType || 'x1'
  const hizbBlock = location.state?.hizbBlock || selectedHizbBlock
  const config = CHALLENGE_CONFIG[challengeType] || CHALLENGE_CONFIG.x1

  const { questions, loading, error, loadProgress, loadChallenge, reset, partialSet } =
    useChallenge(hizbBlock, challengeType)

  const totalQuestions = questions.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [toast, setToast] = useState(null)
  const [saved, setSaved] = useState(false)
  const answeredRef = useRef(false)

  const duration = getTimeForQuestion(currentIndex, challengeType)
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    answeredRef.current = answered
  }, [answered])

  const advanceQuestion = useCallback(() => {
    setToast(null)
    answeredRef.current = false
    setAnswered(false)
    setSelectedChoice(null)

    setCurrentIndex((prev) => {
      if (prev >= totalQuestions - 1) {
        setSessionComplete(true)
        return prev
      }
      return prev + 1
    })
  }, [totalQuestions])

  const handleTimeout = useCallback(() => {
    if (answeredRef.current || !questions.length) return
    answeredRef.current = true
    setAnswered(true)
    setToast({ type: 'miss', text: 'Manqué' })
    setTimeout(() => advanceQuestion(), 1500)
  }, [questions.length, advanceQuestion])

  const { timeLeft, percentage, color } = useTimer(
    duration,
    handleTimeout,
    !answered && !sessionComplete && !!currentQuestion
  )

  useEffect(() => {
    loadChallenge()
    return () => reset()
  }, [loadChallenge, reset])

  const handleChoice = (choice) => {
    if (answeredRef.current || !currentQuestion) return

    const isCorrect = choice === currentQuestion.correct
    answeredRef.current = true
    setAnswered(true)
    setSelectedChoice(choice)

    if (isCorrect) {
      const xp = getXpForCorrect(challengeType, currentIndex)
      setScore((prev) => prev + 1)
      setXpEarned((prev) => prev + xp)
      setToast({ type: 'xp', text: `+${xp} XP` })
    } else {
      setToast({ type: 'miss', text: 'Manqué' })
    }

    setTimeout(() => advanceQuestion(), 1500)
  }

  useEffect(() => {
    if (sessionComplete && !saved) {
      const totalXp =
        challengeType === 'next-ayah'
          ? xpEarned
          : score * (config.xpPerCorrect ?? 0) + (config.xpBonusComplete ?? 0)

      if (user) {
        updateXP(totalXp, {
          challengeType,
          hizbBlock: hizbBlock.label,
          hizbStart: hizbBlock.startHizb,
          hizbEnd: hizbBlock.endHizb,
          score,
          totalQuestions,
        })
      } else {
        saveSessionResult({
          score,
          xpEarned: totalXp,
          hizbBlock: hizbBlock.label,
        })
        updateProfile()
      }

      setXpEarned(totalXp)
      setSaved(true)
    }
  }, [
    sessionComplete,
    saved,
    score,
    xpEarned,
    challengeType,
    config,
    hizbBlock,
    totalQuestions,
    user,
    updateXP,
    updateProfile,
  ])

  const getChoiceState = (choice) => {
    if (!answered) return 'default'
    if (choice === currentQuestion.correct) {
      if (choice === selectedChoice) return 'correct'
      return 'reveal'
    }
    if (choice === selectedChoice) return 'wrong'
    return 'default'
  }

  const getTimerColor = () => {
    if (answered) return 'text-text-secondary'
    if (color === 'red') return 'text-accent-red'
    if (color === 'gold') return 'text-gold-dark'
    return 'text-primary-green'
  }

  const handleReplay = () => {
    answeredRef.current = false
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedChoice(null)
    setSessionComplete(false)
    setXpEarned(0)
    setToast(null)
    setSaved(false)
    loadChallenge()
  }

  const handleChangeBlock = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <LoadingScreen
        progress={loadProgress}
        loadingText={config.loadingText}
      />
    )
  }

  if (error) {
    return <ErrorScreen onRetry={loadChallenge} />
  }

  if (sessionComplete) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-6">
        <EndScreen
          title={config.endTitle}
          score={score}
          totalQuestions={totalQuestions}
          xpEarned={xpEarned}
          onReplay={handleReplay}
          onChangeBlock={handleChangeBlock}
          showLoginBanner={!user}
          onLogin={openAuthModal}
        />
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <LoadingScreen
        progress={loadProgress}
        loadingText={config.loadingText}
      />
    )
  }

  return (
    <div className="px-4 py-4 relative">
      {partialSet && (
        <p className="text-xs text-center text-[#F59E0B] font-medium mb-3">
          {totalQuestions} questions disponibles dans ce bloc
        </p>
      )}

      <div className="mb-4">
        <ProgressDots current={currentIndex} total={totalQuestions} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-text-secondary">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            {config.difficulty && (
              <span
                className={`text-[10px] font-medium rounded-pill px-2 py-0.5 border ${getDifficultyClass(challengeType)}`}
              >
                {config.difficulty}
              </span>
            )}
            <span className={`text-sm font-medium ${getTimerColor()}`}>
              ⏱ {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <TimerBar percentage={percentage} color={color} />
      </div>

      <div className="mb-4">
        <AyahCard text={currentQuestion.display} />
      </div>

      <div className="mb-3 flex justify-center">
        <span className={`text-xs font-medium rounded-pill px-3 py-1 ${config.pillClass}`}>
          {config.questionLabel}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {currentQuestion.choices.map((choice, i) => (
          <ChoiceButton
            key={`${currentIndex}-${i}`}
            index={i}
            text={choice}
            state={getChoiceState(choice)}
            onClick={() => handleChoice(choice)}
            disabled={answered}
          />
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.text}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className={`fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2 rounded-pill font-bold text-sm ${
              toast.type === 'xp'
                ? 'xp-badge text-base'
                : 'bg-accent-red text-white'
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
