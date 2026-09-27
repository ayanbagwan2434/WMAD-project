export const courts = [
  { id: 'court-01', name: 'Court 01', surface: 'Clay', rate: 28, status: 'Available' },
  { id: 'court-02', name: 'Court 02', surface: 'Hard court', rate: 24, status: 'Available' },
  { id: 'court-03', name: 'Court 03', surface: 'Grass', rate: 32, status: 'Popular' },
]

export const matches = [
  {
    id: 'match-01',
    title: 'Rally before work',
    day: 'Today',
    time: '07:30',
    court: 'Court 02',
    level: 'Intermediate',
    players: 3,
    capacity: 4,
    host: 'Sam Rivera',
    initials: 'SR',
    color: 'mint',
  },
  {
    id: 'match-02',
    title: 'Thursday doubles',
    day: 'Today',
    time: '18:00',
    court: 'Court 01',
    level: 'All levels',
    players: 2,
    capacity: 4,
    host: 'Jamie Chen',
    initials: 'JC',
    color: 'peach',
  },
  {
    id: 'match-03',
    title: 'Weekend singles',
    day: 'Sat, Oct 03',
    time: '10:00',
    court: 'Court 03',
    level: 'Advanced',
    players: 1,
    capacity: 2,
    host: 'Alex Morgan',
    initials: 'AM',
    color: 'yellow',
  },
]

export const timeSlots = ['07:00', '08:30', '10:00', '12:30', '16:00', '17:30', '19:00']