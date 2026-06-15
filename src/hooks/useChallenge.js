import { useState, useCallback } from 'react'
import {
  fetchHizbBlock,
  fetchHizbPages,
  buildQuestions,
  buildNextAyahQuestions,
  buildNextPageQuestions,
} from '../services/quranApi'

export function useChallenge(hizbBlock, challengeType = 'x1') {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadProgress, setLoadProgress] = useState({ current: 0, total: 0 })
  const [partialSet, setPartialSet] = useState(false)

  const loadChallenge = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPartialSet(false)

    try {
      if (challengeType === 'next-page') {
        setLoadProgress({ current: 0, total: 0 })

        const pages = await fetchHizbPages(hizbBlock, (loaded, total) => {
          setLoadProgress({ current: loaded, total })
        })

        const session = buildNextPageQuestions(pages)
        if (session.length < 5) {
          throw new Error('Pas assez de pages consécutives pour ce bloc (minimum 5)')
        }
        setPartialSet(session.length < 10)
        setQuestions(session)
        return
      }

      const totalQuarters = (hizbBlock.endHizb - hizbBlock.startHizb + 1) * 4
      setLoadProgress({ current: 0, total: totalQuarters })

      const allAyahs = await fetchHizbBlock(hizbBlock, (_ayahCount, quartersLoaded, total) => {
        setLoadProgress({ current: quartersLoaded, total })
      })

      const build =
        challengeType === 'next-ayah' ? buildNextAyahQuestions : buildQuestions
      const session = build(allAyahs)
      if (session.length < 10) {
        throw new Error('Pas assez de questions pour ce bloc')
      }
      setQuestions(session.slice(0, 10))
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [hizbBlock, challengeType])

  const reset = useCallback(() => {
    setQuestions([])
    setError(null)
    setLoading(false)
    setLoadProgress({ current: 0, total: 0 })
    setPartialSet(false)
  }, [])

  return { questions, loading, error, loadProgress, loadChallenge, reset, partialSet }
}
