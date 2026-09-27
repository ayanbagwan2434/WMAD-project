import { BookOpen, House, Moon, Sun, Trophy, UserRound, Zap } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'quests', label: 'Daily quests', icon: Zap },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'progress', label: 'Progress log', icon: BookOpen },
  { id: 'profile', label: 'My profile', icon: UserRound },
]

export default function Navbar({ activePage, onNavigate, profile, level, dark, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => onNavigate('dashboard')} aria-label="LevelUp dashboard">
        <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
        <span>level<span>up</span></span>
      </button>
      <p className="sidebar-label">YOUR SPACE</p>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            className={`side-link ${activePage === id ? 'active' : ''}`}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={activePage === id ? 'page' : undefined}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {activePage === id && <i />}
          </button>
        ))}
      </nav>
      <div className="sidebar-prompt"><span>✳</span><strong>Small steps.<br />Big momentum.</strong><small>Your next level is closer than you think.</small></div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" type="button" onClick={onToggleTheme}>{dark ? <Sun size={17} /> : <Moon size={17} />}<span>{dark ? 'Light mode' : 'Dark mode'}</span><i className={dark ? 'enabled' : ''}><b /></i></button>
        <button className="sidebar-user" type="button" onClick={() => onNavigate('profile')}><span className="user-avatar">{profile.avatar}</span><span><strong>{profile.name}</strong><small>LEVEL {String(level).padStart(2, '0')} · EXPLORER</small></span></button>
      </div>
    </aside>
  )
}