import { useState, useEffect, useCallback, useRef } from 'react'

const X1_TIMER_SPIRAL = [45, 40, 35, 30, 25, 20, 15, 12, 8, 5]

export function getTimeForQuestion(questionIndex, challengeType) {
  if (challengeType === 'x1') {
    return X1_TIMER_SPIRAL[Math.min(questionIndex, X1_TIMER_SPIRAL.length - 1)]
  }
  return Math.max(15, 60 - questionIndex * 5)
}

export function useTimer(duration, onTimeout, isActive) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeoutRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, duration])

  const pause = useCallback(() => {
    setTimeLeft((prev) => prev)
  }, [])

  const percentage = (timeLeft / duration) * 100

  let color = 'emerald'
  if (percentage <= 25) color = 'red'
  else if (percentage <= 50) color = 'gold'

  return { timeLeft, percentage, color, pause }
}
