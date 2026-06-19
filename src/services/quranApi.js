const BASE = 'https://api.alquran.cloud/v1'
const cache = new Map()

export async function fetchHizbBlock(hizbBlock, onProgress) {
  const cacheKey = hizbBlock.label
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (onProgress) {
      const totalQuarters = (hizbBlock.endHizb - hizbBlock.startHizb + 1) * 4
      onProgress(cached.length, totalQuarters, totalQuarters)
    }
    return cached
  }

  const allAyahs = []
  const startQuarter = (hizbBlock.startHizb - 1) * 4 + 1
  const endQuarter = hizbBlock.endHizb * 4
  const totalQuarters = endQuarter - startQuarter + 1

  for (let q = startQuarter; q <= endQuarter; q++) {
    const res = await fetch(`${BASE}/hizbQuarter/${q}/ar.uthmani`)
    if (!res.ok) throw new Error(`Failed to fetch hizb quarter ${q}`)
    const data = await res.json()
    if (data.code === 200) {
      data.data.ayahs.forEach((a) => allAyahs.push(a))
    }
    if (onProgress) {
      const quartersLoaded = q - startQuarter + 1
      onProgress(allAyahs.length, quartersLoaded, totalQuarters)
    }
  }

  const unique = Array.from(new Map(allAyahs.map((a) => [a.number, a])).values())
  cache.set(cacheKey, unique)
  if (onProgress) onProgress(unique.length, totalQuarters, totalQuarters)
  return unique
}

async function fetchPageAyahs(pageNum) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${BASE}/page/${pageNum}/ar.uthmani`)
    if (res.ok) {
      const data = await res.json()
      if (data.code === 200) return data.data.ayahs
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 400))
  }
  return null
}

export function buildQuestions(allAyahs) {
  const bySurah = new Map()
  allAyahs.forEach((a) => {
    if (!bySurah.has(a.surah.number)) bySurah.set(a.surah.number, [])
    bySurah.get(a.surah.number).push(a)
  })
  bySurah.forEach((ayahs) => ayahs.sort((a, b) => a.numberInSurah - b.numberInSurah))

  const eligible = []
  bySurah.forEach((ayahs, surahNum) => {
    for (let i = 1; i < ayahs.length; i++) {
      if (ayahs[i].numberInSurah === ayahs[i - 1].numberInSurah + 1) {
        eligible.push({
          display: ayahs[i].text,
          correct: ayahs[i - 1].text,
          surahNumber: surahNum,
          allSurahAyahs: ayahs,
        })
      }
    }
  })

  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  const usedSurahs = new Set()
  const questions = []

  for (const q of shuffled) {
    if (questions.length >= 10) break
    if (!usedSurahs.has(q.surahNumber)) {
      usedSurahs.add(q.surahNumber)

      const sameSurahWrong = q.allSurahAyahs
        .filter((a) => a.text !== q.correct && a.text !== q.display)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((a) => a.text)

      let wrongAnswers = sameSurahWrong
      if (wrongAnswers.length < 3) {
        const fallback = eligible
          .filter((e) => e.surahNumber !== q.surahNumber && e.correct !== q.correct)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3 - wrongAnswers.length)
          .map((e) => e.correct)
        wrongAnswers = [...wrongAnswers, ...fallback]
      }

      const choices = [q.correct, ...wrongAnswers].sort(() => Math.random() - 0.5)
      questions.push({ display: q.display, correct: q.correct, choices })
    }
  }

  if (questions.length < 10) {
    for (const q of shuffled) {
      if (questions.length >= 10) break
      if (!questions.find((ex) => ex.display === q.display)) {
        const wrongAnswers = q.allSurahAyahs
          .filter((a) => a.text !== q.correct && a.text !== q.display)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((a) => a.text)
        const choices = [q.correct, ...wrongAnswers].sort(() => Math.random() - 0.5)
        questions.push({ display: q.display, correct: q.correct, choices })
      }
    }
  }

  return questions
}

export function buildNextAyahQuestions(allAyahs) {
  const bySurah = new Map()
  allAyahs.forEach((a) => {
    if (!bySurah.has(a.surah.number)) bySurah.set(a.surah.number, [])
    bySurah.get(a.surah.number).push(a)
  })
  bySurah.forEach((ayahs) => ayahs.sort((a, b) => a.numberInSurah - b.numberInSurah))

  const eligible = []
  bySurah.forEach((ayahs, surahNum) => {
    for (let i = 0; i < ayahs.length - 1; i++) {
      if (ayahs[i + 1].numberInSurah === ayahs[i].numberInSurah + 1) {
        eligible.push({
          display: ayahs[i].text,
          correct: ayahs[i + 1].text,
          surahNumber: surahNum,
        })
      }
    }
  })

  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  const usedSurahs = new Set()
  const questions = []

  for (const q of shuffled) {
    if (questions.length >= 10) break
    if (!usedSurahs.has(q.surahNumber)) {
      usedSurahs.add(q.surahNumber)
      const wrongPool = eligible.filter(
        (e) => e.surahNumber !== q.surahNumber && e.correct !== q.correct
      )
      const wrongAnswers = wrongPool
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((e) => e.correct)
      if (wrongAnswers.length < 3) continue
      const choices = [q.correct, ...wrongAnswers].sort(() => Math.random() - 0.5)
      questions.push({ display: q.display, correct: q.correct, choices })
    }
  }

  if (questions.length < 10) {
    for (const q of shuffled) {
      if (questions.length >= 10) break
      if (!questions.find((ex) => ex.display === q.display)) {
        const wrongPool = eligible.filter(
          (e) => e.display !== q.display && e.correct !== q.correct
        )
        const wrongAnswers = wrongPool
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((e) => e.correct)
        if (wrongAnswers.length < 3) continue
        const choices = [q.correct, ...wrongAnswers].sort(() => Math.random() - 0.5)
        questions.push({ display: q.display, correct: q.correct, choices })
      }
    }
  }

  return questions
}

export async function fetchHizbPages(hizbBlock, onProgress) {
  const cacheKey = 'pages_' + hizbBlock.label
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (onProgress) onProgress(cached.size, cached.size)
    return cached
  }

  const allAyahs = await fetchHizbBlock(hizbBlock)
  const pageNumbers = [...new Set(allAyahs.map((a) => a.page))].sort((a, b) => a - b)

  const pages = new Map()
  for (let i = 0; i < pageNumbers.length; i++) {
    const ayahs = await fetchPageAyahs(pageNumbers[i])
    if (ayahs) pages.set(pageNumbers[i], ayahs)
    if (onProgress) onProgress(i + 1, pageNumbers.length)
  }

  cache.set(cacheKey, pages)
  return pages
}

export function buildNextPageQuestions(pages) {
  const pageNums = Array.from(pages.keys()).sort((a, b) => a - b)

  const eligible = []
  for (let i = 0; i < pageNums.length - 1; i++) {
    const currentPage = pageNums[i]
    const nextPage = pageNums[i + 1]

    if (nextPage !== currentPage + 1) continue

    const currentAyahs = pages.get(currentPage)
    const nextAyahs = pages.get(nextPage)

    if (!currentAyahs?.length || !nextAyahs?.length) continue

    eligible.push({
      currentPage,
      nextPage,
      currentAyahs,
      firstAyahNextPage: nextAyahs[0].text,
    })
  }

  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 10)

  const questions = selected
    .map((item) => {
      const randomIdx = Math.floor(Math.random() * item.currentAyahs.length)
      const displayAyah = item.currentAyahs[randomIdx].text

      const wrongPool = eligible
        .filter((e) => e.nextPage !== item.nextPage)
        .map((e) => e.firstAyahNextPage)
        .filter((text) => text !== item.firstAyahNextPage)

      const wrongAnswers = [...new Set(wrongPool)]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      if (wrongAnswers.length < 3) return null

      const choices = [item.firstAyahNextPage, ...wrongAnswers].sort(
        () => Math.random() - 0.5
      )

      return {
        display: displayAyah,
        correct: item.firstAyahNextPage,
        choices,
      }
    })
    .filter(Boolean)

  return questions
}
