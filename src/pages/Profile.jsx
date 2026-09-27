import { useState } from 'react'
import { Award, BookOpen, Check, Flame, Pencil, Save, ShieldCheck, Trophy, UserRound, Zap } from 'lucide-react'

const badgeIcons = { zap: Zap, flame: Flame, book: BookOpen, trophy: Trophy }

export default function Profile({ state, streak, level, badges, onUpdateProfile }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(state.profile.name)
  const [major, setMajor] = useState(state.profile.major)
  const [year, setYear] = useState(state.profile.year)
  function save(event) {
    event.preventDefault()
    const cleanName = name.trim() || 'Student'
    onUpdateProfile({ ...state.profile, name: cleanName, major: major.trim() || 'Undeclared', year, avatar: cleanName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() })
    setEditing(false)
  }
  const xpThisLevel = state.xp % 500
  return <><div className="page-heading"><div><p className="eyebrow">YOUR PLAYER CARD</p><h1>This is <em>your story.</em></h1><p className="subheading">Look how far you’ve come. Keep writing the next chapter.</p></div><button className="button button-quiet" onClick={() => setEditing((value) => !value)}>{editing ? <Save size={16} /> : <Pencil size={16} />}{editing ? 'Save profile' : 'Edit profile'}</button></div><div className="profile-grid"><section className="player-card panel"><div className="player-cover"><span>LEVEL {String(level).padStart(2, '0')}</span><Award size={34} /></div><div className="player-info"><span className="player-avatar">{state.profile.avatar}</span>{editing ? <form className="profile-edit-form" onSubmit={save}><label>Display name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Area of study<input value={major} onChange={(event) => setMajor(event.target.value)} /></label><label>Year<select value={year} onChange={(event) => setYear(event.target.value)}><option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option><option>Graduate</option></select></label><button className="button button-accent" type="submit"><Save size={15} /> Save changes</button></form> : <><h2>{state.profile.name}</h2><p>@{state.profile.name.toLowerCase().replace(/\s+/g, '')}</p><div className="player-tags"><span>{state.profile.major}</span><span>{state.profile.year}</span></div><div className="profile-xp"><Zap size={16} fill="currentColor" /> {state.xp.toLocaleString()} XP <i>·</i> <Flame size={16} /> {streak} day streak</div><div className="profile-level"><span>LEVEL PROGRESS</span><span>{xpThisLevel} / 500 XP</span></div><div className="wide-progress"><i style={{ width: `${xpThisLevel / 5}%` }} /></div></>}</div></section><section className="achievement-panel panel"><div className="panel-heading"><div><p className="eyebrow">MILESTONES UNLOCKED</p><h2>Achievement badges</h2></div><span className="badge-counter">{badges.filter((badge) => badge.unlocked).length}/{badges.length}</span></div><div className="badge-grid">{badges.map((badge) => { const Icon = badgeIcons[badge.icon] || Award; return <article className={`badge-item ${badge.unlocked ? 'unlocked' : ''}`} key={badge.name}><span className="badge-icon"><Icon size={21} /></span><b>{badge.name}</b><small>{badge.note}</small><span className="badge-status">{badge.unlocked ? <><Check size={11} /> EARNED</> : <><ShieldCheck size={11} /> LOCKED</>}</span></article> })}</div></section></div><p className="profile-note"><UserRound size={15} /> Your profile and progress are saved on this device.</p></>
}
