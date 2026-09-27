import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DailyQuests from './pages/DailyQuests.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import ProgressLog from './pages/ProgressLog.jsx'
import Profile from './pages/Profile.jsx'
import { supabase } from './supabase.js'
import './App.css'

const STORAGE_KEY = 'levelup-student-life'
const XP_PER_LEVEL = 500
const initialQuests = [
  { id: 'study', title: 'Deep study session', detail: 'Study for 2 focused hours', category: 'Study', xp: 50, icon: 'book' },
  { id: 'code', title: 'Ship your assignment', detail: 'Complete a coding assignment', category: 'Build', xp: 100, icon: 'code' },
  { id: 'workout', title: 'Move your body', detail: 'Get in a 30-minute workout', category: 'Wellbeing', xp: 50, icon: 'move' },
  { id: 'reading', title: 'Read a little further', detail: 'Read 20 pages of a book', category: 'Reading', xp: 30, icon: 'read' },
]

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function freshState() {
  return {
    profile: { name: 'Jordan Davis', major: 'Computer Science', year: 'Year 2', avatar: 'JD' },
    xp: 1240,
    quests: initialQuests,
    completed: { [dateKey()]: ['study'] },
    activeDates: [dateKey()],
    dark: true,
  }
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return stored?.profile && Array.isArray(stored.quests) ? { ...freshState(), ...stored } : freshState()
  } catch {
    return freshState()
  }
}

function getStreak(activeDates) {
  const days = new Set(activeDates)
  const cursor = new Date()
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let count = 0
  while (days.has(dateKey(cursor))) {
    count += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [page, setPage] = useState('dashboard')
  const [cloudUserId, setCloudUserId] = useState(null)
  const [syncStatus, setSyncStatus] = useState(supabase ? 'connecting' : 'local')
  const [storageReady, setStorageReady] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return undefined
    let cancelled = false

    async function connectAndLoad() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        let session = sessionData.session
        if (!session) {
          const { data, error } = await supabase.auth.signInAnonymously()
          if (error) throw error
          session = data.session
        }
        if (!session) throw new Error('Could not create a Supabase session.')

        const userId = session.user.id
        const { data: savedRow, error: loadError } = await supabase
          .from('levelup_progress')
          .select('state')
          .eq('user_id', userId)
          .maybeSingle()
        if (loadError) throw loadError
        if (cancelled) return

        if (savedRow?.state?.profile && Array.isArray(savedRow.state.quests)) {
          setState({ ...freshState(), ...savedRow.state })
        }
        setCloudUserId(userId)
        setSyncStatus('connected')
      } catch (error) {
        console.error('LevelUp cloud sync unavailable:', error)
        if (!cancelled) setSyncStatus('error')
      } finally {
        if (!cancelled) setStorageReady(true)
      }
    }

    connectAndLoad()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!storageReady) return undefined
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    if (!supabase || !cloudUserId) return undefined

    const timeout = window.setTimeout(async () => {
      setSyncStatus('syncing')
      const { error } = await supabase.from('levelup_progress').upsert({
        user_id: cloudUserId,
        state,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setSyncStatus(error ? 'error' : 'connected')
      if (error) console.error('LevelUp progress sync failed:', error)
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [state, cloudUserId, storageReady])

  const today = dateKey()
  const completedToday = state.completed[today] || []
  const streak = getStreak(state.activeDates)
  const level = Math.floor(state.xp / XP_PER_LEVEL) + 1
  const badges = useMemo(() => [
    { name: 'First Step', note: 'Earn your first XP', icon: 'zap', unlocked: state.xp > 0 },
    { name: 'On Fire', note: 'Build a 3-day streak', icon: 'flame', unlocked: streak >= 3 },
    { name: 'Bookworm', note: 'Complete 5 quests', icon: 'book', unlocked: Object.values(state.completed).flat().length >= 5 },
    { name: 'High Achiever', note: 'Reach level 5', icon: 'trophy', unlocked: level >= 5 },
  ], [state, streak, level])

  function completeQuest(quest) {
    setState((current) => {
      const currentDone = current.completed[today] || []
      if (currentDone.includes(quest.id)) return current
      return {
        ...current,
        xp: current.xp + quest.xp,
        completed: { ...current.completed, [today]: [...currentDone, quest.id] },
        activeDates: [...new Set([...current.activeDates, today])],
      }
    })
  }

  function addQuest(quest) {
    setState((current) => ({ ...current, quests: [{ ...quest, id: `quest-${Date.now()}` }, ...current.quests] }))
  }

  function updateProfile(profile) {
    setState((current) => ({ ...current, profile }))
  }

  const pageProps = { state, streak, level, badges, completedToday, onNavigate: setPage, onComplete: completeQuest, onAddQuest: addQuest, onUpdateProfile: updateProfile }

  return (
    <div className={`levelup-app ${state.dark ? 'theme-dark' : 'theme-light'}`}>
      <Navbar activePage={page} onNavigate={setPage} profile={state.profile} level={level} dark={state.dark} onToggleTheme={() => setState((current) => ({ ...current, dark: !current.dark }))} />
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb"><span>MY SPACE</span><b>/</b><strong>{page.replace('-', ' ')}</strong></div><div className="topbar-right"><span className={`sync-state sync-${syncStatus}`}><i />{syncStatus === 'local' ? 'Saved on this device' : syncStatus === 'connecting' ? 'Connecting cloud' : syncStatus === 'syncing' ? 'Syncing progress' : syncStatus === 'error' ? 'Cloud setup needed' : 'Cloud synced'}</span><span className="topbar-date">{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span></div></header>
        <div className="page-content">
          {page === 'dashboard' && <Dashboard {...pageProps} />}
          {page === 'quests' && <DailyQuests {...pageProps} />}
          {page === 'leaderboard' && <Leaderboard {...pageProps} />}
          {page === 'progress' && <ProgressLog {...pageProps} />}
          {page === 'profile' && <Profile {...pageProps} />}
        </div>
        <footer className="app-footer"><span>LEVELUP <i>·</i> STUDENT LIFE RPG</span><span>Progress over perfection <b>✳</b></span></footer>
      </main>
    </div>
  )
}