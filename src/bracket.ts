export type RoundKey = 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL'

export type Team = {
  code: string
  name: string
  flag: string
}

export type Slot =
  | {
      type: 'team'
      team: Team
    }
  | {
      type: 'winner'
      matchId: MatchId
    }

export type MatchId =
  | 'M73'
  | 'M74'
  | 'M75'
  | 'M76'
  | 'M77'
  | 'M78'
  | 'M79'
  | 'M80'
  | 'M81'
  | 'M82'
  | 'M83'
  | 'M84'
  | 'M85'
  | 'M86'
  | 'M87'
  | 'M88'
  | 'M89'
  | 'M90'
  | 'M91'
  | 'M92'
  | 'M93'
  | 'M94'
  | 'M95'
  | 'M96'
  | 'M97'
  | 'M98'
  | 'M99'
  | 'M100'
  | 'M101'
  | 'M102'
  | 'M104'

export type Match = {
  id: MatchId
  round: RoundKey
  venue: string
  date: string
  slots: [Slot, Slot]
}

export type Picks = Partial<Record<MatchId, string>>

const t = (code: string, name: string, flag: string): Team => ({ code, name, flag })
const team = (value: Team): Slot => ({ type: 'team', team: value })
const winner = (matchId: MatchId): Slot => ({ type: 'winner', matchId })

export const teams = {
  RSA: t('RSA', 'South Africa', '🇿🇦'),
  CAN: t('CAN', 'Canada', '🇨🇦'),
  GER: t('GER', 'Germany', '🇩🇪'),
  PAR: t('PAR', 'Paraguay', '🇵🇾'),
  NED: t('NED', 'Netherlands', '🇳🇱'),
  MAR: t('MAR', 'Morocco', '🇲🇦'),
  BRA: t('BRA', 'Brazil', '🇧🇷'),
  JPN: t('JPN', 'Japan', '🇯🇵'),
  FRA: t('FRA', 'France', '🇫🇷'),
  SWE: t('SWE', 'Sweden', '🇸🇪'),
  CIV: t('CIV', "Cote d'Ivoire", '🇨🇮'),
  NOR: t('NOR', 'Norway', '🇳🇴'),
  MEX: t('MEX', 'Mexico', '🇲🇽'),
  ECU: t('ECU', 'Ecuador', '🇪🇨'),
  ENG: t('ENG', 'England', '🇬🇧'),
  COD: t('COD', 'DR Congo', '🇨🇩'),
  USA: t('USA', 'USA', '🇺🇸'),
  BIH: t('BIH', 'Bosnia and Herzegovina', '🇧🇦'),
  BEL: t('BEL', 'Belgium', '🇧🇪'),
  SEN: t('SEN', 'Senegal', '🇸🇳'),
  POR: t('POR', 'Portugal', '🇵🇹'),
  CRO: t('CRO', 'Croatia', '🇭🇷'),
  ESP: t('ESP', 'Spain', '🇪🇸'),
  AUT: t('AUT', 'Austria', '🇦🇹'),
  SUI: t('SUI', 'Switzerland', '🇨🇭'),
  ALG: t('ALG', 'Algeria', '🇩🇿'),
  ARG: t('ARG', 'Argentina', '🇦🇷'),
  CPV: t('CPV', 'Cape Verde', '🇨🇻'),
  COL: t('COL', 'Colombia', '🇨🇴'),
  GHA: t('GHA', 'Ghana', '🇬🇭'),
  AUS: t('AUS', 'Australia', '🇦🇺'),
  EGY: t('EGY', 'Egypt', '🇪🇬'),
}

export const matches: Record<MatchId, Match> = {
  M73: {
    id: 'M73',
    round: 'R32',
    venue: 'Los Angeles Stadium',
    date: '28 Jun, 21:00',
    slots: [team(teams.RSA), team(teams.CAN)],
  },
  M74: {
    id: 'M74',
    round: 'R32',
    venue: 'Boston Stadium',
    date: '29 Jun, 22:30',
    slots: [team(teams.GER), team(teams.PAR)],
  },
  M75: {
    id: 'M75',
    round: 'R32',
    venue: 'Monterrey Stadium',
    date: '30 Jun, 03:00',
    slots: [team(teams.NED), team(teams.MAR)],
  },
  M76: {
    id: 'M76',
    round: 'R32',
    venue: 'Houston Stadium',
    date: '29 Jun, 19:00',
    slots: [team(teams.BRA), team(teams.JPN)],
  },
  M77: {
    id: 'M77',
    round: 'R32',
    venue: 'New York/New Jersey Stadium',
    date: '30 Jun, 23:00',
    slots: [team(teams.FRA), team(teams.SWE)],
  },
  M78: {
    id: 'M78',
    round: 'R32',
    venue: 'Dallas Stadium',
    date: '30 Jun, 19:00',
    slots: [team(teams.CIV), team(teams.NOR)],
  },
  M79: {
    id: 'M79',
    round: 'R32',
    venue: 'Mexico City Stadium',
    date: '1 Jul, 03:00',
    slots: [team(teams.MEX), team(teams.ECU)],
  },
  M80: {
    id: 'M80',
    round: 'R32',
    venue: 'Atlanta Stadium',
    date: '1 Jul, 18:00',
    slots: [team(teams.ENG), team(teams.COD)],
  },
  M81: {
    id: 'M81',
    round: 'R32',
    venue: 'San Francisco Bay Stadium',
    date: '2 Jul, 02:00',
    slots: [team(teams.USA), team(teams.BIH)],
  },
  M82: {
    id: 'M82',
    round: 'R32',
    venue: 'Seattle Stadium',
    date: '1 Jul, 22:00',
    slots: [team(teams.BEL), team(teams.SEN)],
  },
  M83: {
    id: 'M83',
    round: 'R32',
    venue: 'Toronto Stadium',
    date: '3 Jul, 01:00',
    slots: [team(teams.POR), team(teams.CRO)],
  },
  M84: {
    id: 'M84',
    round: 'R32',
    venue: 'Los Angeles Stadium',
    date: '2 Jul, 21:00',
    slots: [team(teams.ESP), team(teams.AUT)],
  },
  M85: {
    id: 'M85',
    round: 'R32',
    venue: 'Vancouver Stadium',
    date: '3 Jul, 05:00',
    slots: [team(teams.SUI), team(teams.ALG)],
  },
  M86: {
    id: 'M86',
    round: 'R32',
    venue: 'Miami Stadium',
    date: '4 Jul, 00:00',
    slots: [team(teams.ARG), team(teams.CPV)],
  },
  M87: {
    id: 'M87',
    round: 'R32',
    venue: 'Kansas City Stadium',
    date: '4 Jul, 03:30',
    slots: [team(teams.COL), team(teams.GHA)],
  },
  M88: {
    id: 'M88',
    round: 'R32',
    venue: 'Dallas Stadium',
    date: '3 Jul, 20:00',
    slots: [team(teams.AUS), team(teams.EGY)],
  },
  M89: {
    id: 'M89',
    round: 'R16',
    venue: 'Houston Stadium',
    date: '4 Jul, 19:00',
    slots: [winner('M73'), winner('M75')],
  },
  M90: {
    id: 'M90',
    round: 'R16',
    venue: 'Philadelphia Stadium',
    date: '4 Jul, 23:00',
    slots: [winner('M74'), winner('M77')],
  },
  M91: {
    id: 'M91',
    round: 'R16',
    venue: 'New York/New Jersey Stadium',
    date: '5 Jul, 22:00',
    slots: [winner('M76'), winner('M78')],
  },
  M92: {
    id: 'M92',
    round: 'R16',
    venue: 'Mexico City Stadium',
    date: '6 Jul, 02:00',
    slots: [winner('M79'), winner('M80')],
  },
  M93: {
    id: 'M93',
    round: 'R16',
    venue: 'Dallas Stadium',
    date: '6 Jul, 21:00',
    slots: [winner('M83'), winner('M84')],
  },
  M94: {
    id: 'M94',
    round: 'R16',
    venue: 'Seattle Stadium',
    date: '7 Jul, 02:00',
    slots: [winner('M81'), winner('M82')],
  },
  M95: {
    id: 'M95',
    round: 'R16',
    venue: 'Atlanta Stadium',
    date: '7 Jul, 21:00',
    slots: [winner('M86'), winner('M88')],
  },
  M96: {
    id: 'M96',
    round: 'R16',
    venue: 'Vancouver Stadium',
    date: '8 Jul, 02:00',
    slots: [winner('M85'), winner('M87')],
  },
  M97: {
    id: 'M97',
    round: 'QF',
    venue: 'Boston Stadium',
    date: '9 Jul, 22:00',
    slots: [winner('M89'), winner('M90')],
  },
  M98: {
    id: 'M98',
    round: 'QF',
    venue: 'Los Angeles Stadium',
    date: '10 Jul, 21:00',
    slots: [winner('M93'), winner('M94')],
  },
  M99: {
    id: 'M99',
    round: 'QF',
    venue: 'Miami Stadium',
    date: '11 Jul, 23:00',
    slots: [winner('M91'), winner('M92')],
  },
  M100: {
    id: 'M100',
    round: 'QF',
    venue: 'Kansas City Stadium',
    date: '12 Jul, 03:00',
    slots: [winner('M95'), winner('M96')],
  },
  M101: {
    id: 'M101',
    round: 'SF',
    venue: 'Dallas Stadium',
    date: '15 Jul, 02:00',
    slots: [winner('M97'), winner('M98')],
  },
  M102: {
    id: 'M102',
    round: 'SF',
    venue: 'Atlanta Stadium',
    date: '16 Jul, 02:00',
    slots: [winner('M99'), winner('M100')],
  },
  M104: {
    id: 'M104',
    round: 'FINAL',
    venue: 'New York/New Jersey Stadium',
    date: '19 Jul, 21:00',
    slots: [winner('M101'), winner('M102')],
  },
}

export const pickOrder: MatchId[] = [
  'M73',
  'M75',
  'M74',
  'M77',
  'M83',
  'M84',
  'M81',
  'M82',
  'M76',
  'M78',
  'M79',
  'M80',
  'M86',
  'M88',
  'M85',
  'M87',
  'M89',
  'M90',
  'M93',
  'M94',
  'M91',
  'M92',
  'M95',
  'M96',
  'M97',
  'M98',
  'M99',
  'M100',
  'M101',
  'M102',
  'M104',
]

export const exportSides = {
  left: ['M73', 'M75', 'M74', 'M77', 'M83', 'M84', 'M81', 'M82'] as MatchId[],
  right: ['M76', 'M78', 'M79', 'M80', 'M86', 'M88', 'M85', 'M87'] as MatchId[],
}

export const roundLabels: Record<RoundKey, string> = {
  R32: 'R32',
  R16: 'R16',
  QF: 'QF',
  SF: 'SF',
  FINAL: 'Final',
}

export function resolveSlot(slot: Slot, picks: Picks): Team | null {
  if (slot.type === 'team') {
    return slot.team
  }

  const code = picks[slot.matchId]
  if (!code) {
    return null
  }

  return resolveMatchTeams(matches[slot.matchId], picks).find((entry) => entry?.code === code) ?? null
}

export function resolveMatchTeams(match: Match, picks: Picks): [Team | null, Team | null] {
  return [resolveSlot(match.slots[0], picks), resolveSlot(match.slots[1], picks)]
}

export function getWinner(matchId: MatchId, picks: Picks): Team | null {
  const code = picks[matchId]
  if (!code) {
    return null
  }
  return resolveMatchTeams(matches[matchId], picks).find((teamValue) => teamValue?.code === code) ?? null
}

export function isReady(matchId: MatchId, picks: Picks): boolean {
  return resolveMatchTeams(matches[matchId], picks).every(Boolean)
}

export function getFirstOpenMatch(picks: Picks): MatchId | null {
  return pickOrder.find((matchId) => isReady(matchId, picks) && !picks[matchId]) ?? null
}

export function getLastPickedMatch(picks: Picks): MatchId | null {
  return pickOrder.filter((matchId) => picks[matchId]).at(-1) ?? null
}

export function clearDependents(changedMatchId: MatchId, picks: Picks): Picks {
  const next = { ...picks }
  const queue: MatchId[] = [changedMatchId]
  delete next[changedMatchId]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }

    for (const match of Object.values(matches)) {
      if (match.slots.some((slot) => slot.type === 'winner' && slot.matchId === current)) {
        if (next[match.id]) {
          delete next[match.id]
        }
        queue.push(match.id)
      }
    }
  }

  return next
}
