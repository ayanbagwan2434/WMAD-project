import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Code2, Dumbbell, Plus, Sparkles, Zap } from 'lucide-react'

const glyphs = { book: BookOpen, code: Code2, move: Dumbbell, read: BookOpen, target: Sparkles }

export default function DailyQuests({ state, completedToday, onComplete, onAddQuest }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [xp, setXp] = useState(50)
  const [category, setCategory] = useState('Personal')
  function submit(event) {
    event.preventDefault()
    if (!title.trim()) return
    onAddQuest({ title: title.trim(), detail: detail.trim() || 'Make progress on your goal', xp: Number(xp), category, icon: 'target' })
    setTitle('')
    setDetail('')
    setShowForm(false)
  }
  return <><div className="page-heading"><div><p className="eyebrow">YOUR DAILY CAMPAIGN</p><h1>Quests & <em>challenges.</em></h1><p className="subheading">Turn the things you want to do into little wins.</p></div><button className="button button-accent" onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Create quest</button></div>
    {showForm && <form className="create-quest-form" onSubmit={submit}><div><span className="form-spark"><Sparkles size={17} /></span><span><b>Make it yours</b><small>Add one goal to your daily campaign.</small></span></div><label>Quest name<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Review lecture notes" maxLength={56} required /></label><label>Details<input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="What does completing it look like?" maxLength={90} /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Personal</option><option>Study</option><option>Build</option><option>Wellbeing</option><option>Reading</option></select></label><label>XP<input type="number" min="10" max="200" step="10" value={xp} onChange={(event) => setXp(event.target.value)} /></label><button className="button button-accent" type="submit">Add quest <ArrowRight size={15} /></button></form>}
    <section className="quest-progress-panel"><div className="quest-progress-title"><span className="progress-emblem"><Zap size={18} /></span><span><b>{completedToday.length} of {state.quests.length} quests complete</b><small>Every finished quest adds experience to your journey.</small></span><strong>{Math.round(completedToday.length / Math.max(state.quests.length, 1) * 100)}%</strong></div><div className="wide-progress"><i style={{ width: `${completedToday.length / Math.max(state.quests.length, 1) * 100}%` }} /></div></section>
    <div className="quest-groups">{['Study', 'Build', 'Wellbeing', 'Reading', 'Personal'].map((group) => { const quests = state.quests.filter((quest) => quest.category === group); if (!quests.length) return null; return <section className="quest-group" key={group}><div className="group-heading"><h2>{group}</h2><span>{quests.length} QUEST{quests.length === 1 ? '' : 'S'}</span></div>{quests.map((quest) => { const Icon = glyphs[quest.icon] || Sparkles; const done = completedToday.includes(quest.id); return <article className={`quest-detail-row ${done ? 'is-done' : ''}`} key={quest.id}><span className={`quest-symbol symbol-${quest.icon}`}><Icon size={19} /></span><span className="quest-copy"><strong>{quest.title}</strong><small>{quest.detail}</small></span><span className="category-label">{quest.category}</span><span className="quest-xp"><Zap size={13} fill="currentColor" /> +{quest.xp} XP</span><button className={`complete-button ${done ? 'done' : ''}`} disabled={done} onClick={() => onComplete(quest)}>{done ? <><Check size={15} /> Done</> : <>Complete <ArrowRight size={14} /></>}</button></article> })}</section> })}</div>
  </>
}
