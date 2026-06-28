import {
  type MatchId,
  type Picks,
  type Team,
  exportSides,
  getWinner,
  matches,
  resolveMatchTeams,
} from './bracket'

const W = 2200
const H = 1240
const CARD_W = 180
const CARD_H = 34
const CARD_GAP = 9
const ROW_GAP = 54
const TOP = 170
const WINNER = '#20c877'
const NAVY = '#07195d'

const leftR16: MatchId[] = ['M89', 'M90', 'M93', 'M94']
const rightR16: MatchId[] = ['M91', 'M92', 'M95', 'M96']
const leftQF: MatchId[] = ['M97', 'M98']
const rightQF: MatchId[] = ['M99', 'M100']

type Side = 'left' | 'right'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function teamLabel(team: Team | null): string {
  return team ? `${team.flag} ${team.code}` : 'TBD'
}

function slotOffset(index: number): number {
  return index === 0 ? -(CARD_H + CARD_GAP) / 2 : (CARD_H + CARD_GAP) / 2
}

function drawCard({
  x,
  y,
  team,
  selected,
  align,
}: {
  x: number
  y: number
  team: Team | null
  selected: boolean
  align: 'left' | 'right'
}): string {
  const fill = selected ? WINNER : '#ffffff'
  const stroke = selected ? WINNER : '#ffffff'
  const textColor = '#06113f'
  const textX = align === 'left' ? x + 14 : x + CARD_W - 14
  const anchor = align === 'left' ? 'start' : 'end'

  return `
    <rect x="${x}" y="${y - CARD_H / 2}" width="${CARD_W}" height="${CARD_H}" rx="11" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${textX}" y="${y + 8}" text-anchor="${anchor}" font-size="20" font-weight="900" fill="${textColor}">${escapeXml(teamLabel(team))}</text>
  `
}

function drawConnector(x1: number, y1: number, x2: number, y2: number): string {
  const mid = (x1 + x2) / 2
  return `<path d="M ${x1} ${y1} H ${mid} V ${y2} H ${x2}" fill="none" stroke="#dfe7ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`
}

function drawStraightConnector(x1: number, y1: number, x2: number, y2: number): string {
  return `<path d="M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}" fill="none" stroke="#dfe7ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`
}

function cardY(matchCenter: number, slotIndex: number): number {
  return matchCenter + slotOffset(slotIndex)
}

function r32Centers(side: Side): Record<MatchId, number> {
  const centers = {} as Record<MatchId, number>
  exportSides[side].forEach((matchId, index) => {
    centers[matchId] = TOP + (index * 2 + 0.5) * ROW_GAP
  })
  return centers
}

function childMatchIds(matchId: MatchId): [MatchId, MatchId] {
  const [a, b] = matches[matchId].slots
  if (a.type !== 'winner' || b.type !== 'winner') {
    throw new Error(`${matchId} does not have winner slots.`)
  }
  return [a.matchId, b.matchId]
}

function nextCenters(ids: MatchId[], previous: Record<MatchId, number>): Record<MatchId, number> {
  const centers = {} as Record<MatchId, number>
  for (const matchId of ids) {
    const [a, b] = childMatchIds(matchId)
    centers[matchId] = (previous[a] + previous[b]) / 2
  }
  return centers
}

function drawMatch(matchId: MatchId, x: number, y: number, picks: Picks, align: 'left' | 'right'): string {
  const [teamA, teamB] = resolveMatchTeams(matches[matchId], picks)
  const winner = getWinner(matchId, picks)

  return [
    drawCard({ x, y: cardY(y, 0), team: teamA, selected: winner?.code === teamA?.code, align }),
    drawCard({ x, y: cardY(y, 1), team: teamB, selected: winner?.code === teamB?.code, align }),
  ].join('')
}

function drawIncomingConnectors({
  ids,
  centers,
  previousCenters,
  previousX,
  currentX,
  side,
}: {
  ids: MatchId[]
  centers: Record<MatchId, number>
  previousCenters: Record<MatchId, number>
  previousX: number
  currentX: number
  side: Side
}): string {
  const chunks: string[] = []
  const isLeft = side === 'left'
  const fromX = isLeft ? previousX + CARD_W : previousX
  const toX = isLeft ? currentX : currentX + CARD_W

  for (const matchId of ids) {
    childMatchIds(matchId).forEach((sourceId, slotIndex) => {
      chunks.push(drawConnector(fromX, previousCenters[sourceId], toX, cardY(centers[matchId], slotIndex)))
    })
  }

  return chunks.join('')
}

function drawSide(side: Side, picks: Picks): string {
  const isLeft = side === 'left'
  const align = isLeft ? 'left' : 'right'
  const xs = isLeft
    ? { r32: 60, r16: 315, qf: 550, sf: 760 }
    : { r32: W - 60 - CARD_W, r16: W - 315 - CARD_W, qf: W - 550 - CARD_W, sf: W - 760 - CARD_W }
  const r16Ids = isLeft ? leftR16 : rightR16
  const qfIds = isLeft ? leftQF : rightQF
  const sfIds: MatchId[] = [isLeft ? 'M101' : 'M102']
  const r32 = r32Centers(side)
  const r16 = nextCenters(r16Ids, r32)
  const qf = nextCenters(qfIds, r16)
  const sf = nextCenters(sfIds, qf)

  const connectors = [
    drawIncomingConnectors({
      ids: r16Ids,
      centers: r16,
      previousCenters: r32,
      previousX: xs.r32,
      currentX: xs.r16,
      side,
    }),
    drawIncomingConnectors({
      ids: qfIds,
      centers: qf,
      previousCenters: r16,
      previousX: xs.r16,
      currentX: xs.qf,
      side,
    }),
    drawIncomingConnectors({
      ids: sfIds,
      centers: sf,
      previousCenters: qf,
      previousX: xs.qf,
      currentX: xs.sf,
      side,
    }),
  ]

  const cards = [
    ...exportSides[side].map((matchId) => drawMatch(matchId, xs.r32, r32[matchId], picks, align)),
    ...r16Ids.map((matchId) => drawMatch(matchId, xs.r16, r16[matchId], picks, align)),
    ...qfIds.map((matchId) => drawMatch(matchId, xs.qf, qf[matchId], picks, align)),
    ...sfIds.map((matchId) => drawMatch(matchId, xs.sf, sf[matchId], picks, align)),
  ]

  return [...connectors, ...cards].join('')
}

function drawFinal(picks: Picks): string {
  const finalCenterX = W / 2
  const finalX = finalCenterX - 145
  const finalY = 468
  const championY = 665
  const [leftFinalist, rightFinalist] = resolveMatchTeams(matches.M104, picks)
  const champion = getWinner('M104', picks)
  const leftSfCenter = nextCenters(['M101'], nextCenters(leftQF, nextCenters(leftR16, r32Centers('left')))).M101
  const rightSfCenter = nextCenters(['M102'], nextCenters(rightQF, nextCenters(rightR16, r32Centers('right')))).M102

  return `
    ${drawStraightConnector(760 + CARD_W, leftSfCenter, finalX, cardY(finalY + 48, 0))}
    ${drawStraightConnector(W - 760 - CARD_W, rightSfCenter, finalX + 290, cardY(finalY + 48, 1))}
    <rect x="${finalX}" y="${finalY}" width="290" height="150" rx="22" fill="${NAVY}"/>
    <text x="${finalCenterX}" y="${finalY + 38}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" fill="#ff6a00">FINAL</text>
    <text x="${finalCenterX}" y="${finalY + 80}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="900" fill="#ffffff">${escapeXml(teamLabel(leftFinalist))}</text>
    <text x="${finalCenterX}" y="${finalY + 111}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="900" fill="#dfe7ff">vs</text>
    <text x="${finalCenterX}" y="${finalY + 139}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="900" fill="#ffffff">${escapeXml(teamLabel(rightFinalist))}</text>
    <rect x="${finalCenterX - 310}" y="${championY}" width="620" height="116" rx="30" fill="${WINNER}"/>
    <text x="${finalCenterX}" y="${championY + 42}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" fill="#041544">CHAMPION</text>
    <text x="${finalCenterX}" y="${championY + 88}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="1000" fill="#041544">${escapeXml(teamLabel(champion))}</text>
  `
}

export function buildBracketSvg(nickname: string, picks: Picks): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#315dff"/>
      <stop offset="0.58" stop-color="#3567ff"/>
      <stop offset="1" stop-color="#003cff"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#00134f" flood-opacity=".3"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="2050" cy="100" r="430" fill="#003cff" opacity=".88"/>
  <circle cx="120" cy="1210" r="410" fill="#003cff" opacity=".55"/>
  <text x="${W / 2}" y="66" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="900" fill="#ffffff">WC 2026 Bracket Picks</text>
  <text x="${W / 2}" y="108" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="#ff6a00">${escapeXml(nickname || 'Family Bracket')}</text>
  <text x="150" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">R32</text>
  <text x="405" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">R16</text>
  <text x="640" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">QF</text>
  <text x="850" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">SF</text>
  <text x="1350" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">SF</text>
  <text x="1560" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">QF</text>
  <text x="1795" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">R16</text>
  <text x="2050" y="145" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="900" fill="#dfe7ff">R32</text>
  <g filter="url(#shadow)">
    ${drawSide('left', picks)}
    ${drawSide('right', picks)}
    ${drawFinal(picks)}
  </g>
</svg>`.trim()
}

export async function downloadBracketPng(nickname: string, picks: Picks): Promise<void> {
  const svg = buildBracketSvg(nickname, picks)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const image = new Image()
  image.decoding = 'async'

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Could not render bracket image.'))
    image.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    URL.revokeObjectURL(url)
    throw new Error('Canvas is not supported in this browser.')
  }

  ctx.drawImage(image, 0, 0)
  URL.revokeObjectURL(url)

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) {
        resolve(value)
        return
      }
      reject(new Error('Could not create PNG file.'))
    }, 'image/png')
  })
  const pngUrl = URL.createObjectURL(pngBlob)
  const safeName = (nickname || 'bracket').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
  const link = document.createElement('a')
  link.href = pngUrl
  link.download = `wc2026-${safeName || 'bracket'}-picks.png`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(pngUrl), 1000)
}
