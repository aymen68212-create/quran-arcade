const KEYS = {
  XP: 'qa_total_xp',
  STREAK: 'qa_streak',
  LAST_PLAYED: 'qa_last_played',
  SESSIONS: 'qa_sessions',
  BADGES: 'qa_badges',
}

export function getProfile() {
  return {
    totalXP: parseInt(localStorage.getItem(KEYS.XP) || '0', 10),
    streak: parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10),
    lastPlayed: localStorage.getItem(KEYS.LAST_PLAYED),
    sessions: JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]'),
    badges: JSON.parse(localStorage.getItem(KEYS.BADGES) || '[]'),
  }
}

export function saveSessionResult({ score, xpEarned, hizbBlock }) {
  const profile = getProfile()
  const today = new Date().toDateString()

  const newXP = profile.totalXP + xpEarned
  localStorage.setItem(KEYS.XP, String(newXP))

  const yesterday = new Date(Date.now() - 86400000).toDateString()
  let newStreak = profile.streak
  if (profile.lastPlayed === yesterday) newStreak += 1
  else if (profile.lastPlayed !== today) newStreak = 1
  localStorage.setItem(KEYS.STREAK, String(newStreak))
  localStorage.setItem(KEYS.LAST_PLAYED, today)

  const sessions = profile.sessions
  sessions.unshift({ score, xpEarned, hizbBlock, date: today })
  if (sessions.length > 50) sessions.pop()
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions))

  const badges = profile.badges
  if (!badges.includes('first_session')) badges.push('first_session')
  if (score === 10 && !badges.includes('perfect')) badges.push('perfect')
  if (newStreak >= 7 && !badges.includes('streak_7')) badges.push('streak_7')
  localStorage.setItem(KEYS.BADGES, JSON.stringify(badges))

  return { newXP, newStreak, badges }
}
