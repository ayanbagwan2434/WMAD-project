import { Crown, ShieldCheck, Trophy } from 'lucide-react'

export default function Leaderboard({ state }) {
  const players = [
    { name: 'Maya Chen', major: 'Psychology · Year 3', xp: 2480, avatar: 'MC', color: 'ava-maya' },
    { name: state.profile.name, major: `${state.profile.major} · ${state.profile.year}`, xp: state.xp, avatar: state.profile.avatar, color: 'ava-you', you: true },
    { name: 'Andre Kim', major: 'Biology · Year 2', xp: 1180, avatar: 'AK', color: 'ava-andre' },
    { name: 'Priya Shah', major: 'Design · Year 4', xp: 960, avatar: 'PS', color: 'ava-priya' },
    { name: 'Noah Williams', major: 'Economics · Year 1', xp: 740, avatar: 'NW', color: 'ava-noah' },
  ].sort((first, second) => second.xp - first.xp)
  return <><div className="page-heading"><div><p className="eyebrow">YOUR CAMPUS, IN QUESTS</p><h1>Friendly <em>competition.</em></h1><p className="subheading">Every student’s on their own path. Here’s a little inspiration.</p></div><span className="week-label">WEEK 40 <Crown size={15} /></span></div><section className="leaderboard-table panel"><div className="leaderboard-intro"><span className="trophy-medallion"><Trophy size={22} /></span><span><small>THIS WEEK’S STANDINGS</small><b>Campus leaderboard</b></span></div><div className="table-labels"><span>RANK</span><span>STUDENT</span><span>LEVEL</span><span>EXPERIENCE</span></div>{players.map((player, index) => <article className={`leaderboard-row ${player.you ? 'you-row' : ''}`} key={player.name}><span className={`leader-rank ${index < 3 ? `rank-${index + 1}` : ''}`}>{index === 0 ? <Trophy size={16} /> : String(index + 1).padStart(2, '0')}</span><span className="leader-student"><i className={`leader-avatar ${player.color}`}>{player.avatar}</i><span><b>{player.name} {player.you && <small>YOU</small>}</b><small>{player.major}</small></span></span><span className="level-pill">LVL {String(Math.floor(player.xp / 500) + 1).padStart(2, '0')}</span><strong className="leader-total">{player.xp.toLocaleString()} <small>XP</small></strong></article>)}<footer className="leaderboard-foot"><ShieldCheck size={15} /> Your progress is yours. Compete kindly.</footer></section></>
}
