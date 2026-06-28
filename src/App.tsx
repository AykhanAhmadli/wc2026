import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'
import {
  type MatchId,
  type Picks,
  clearDependents,
  getFirstOpenMatch,
  getLastPickedMatch,
  getWinner,
  isReady,
  matches,
  pickOrder,
  resolveMatchTeams,
  roundLabels,
} from './bracket'
import { downloadBracketPng } from './exportImage'

const PICKS_KEY = 'wc2026:picks'
const NICKNAME_KEY = 'wc2026:nickname'
const transitionMs = 260

type View = 'picker' | 'share'

function getInitialView(): View {
  return window.location.hash === '#/share' || window.location.pathname.endsWith('/share')
    ? 'share'
    : 'picker'
}

function getShareUrl(): string {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined
  if (configured) {
    return configured.replace(/\/share\/?$/, '').replace(/\/$/, '')
  }
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString().replace(/\/$/, '')
}

function readPicks(): Picks {
  try {
    return JSON.parse(localStorage.getItem(PICKS_KEY) ?? '{}') as Picks
  } catch {
    return {}
  }
}

function readNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) ?? ''
}

function saveRoute(view: View): void {
  window.history.pushState({}, '', view === 'share' ? '#/share' : import.meta.env.BASE_URL)
}

function TeamOption({
  team,
  selected,
  onPick,
}: {
  team: NonNullable<ReturnType<typeof resolveMatchTeams>[number]>
  selected: boolean
  onPick: () => void
}) {
  return (
    <button
      className={`team-option ${selected ? 'selected' : ''}`}
      type="button"
      onClick={onPick}
      aria-pressed={selected}
    >
      <span className="flag" aria-hidden="true">
        {team.flag}
      </span>
      <span>
        <strong>{team.code}</strong>
        <small>{team.name}</small>
      </span>
      <span className="radio-mark" aria-hidden="true" />
    </button>
  )
}

function NicknameScreen({ onSave }: { onSave: (name: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <main className="app-screen intro-screen">
      <section className="intro-panel">
        <p className="eyebrow">FIFA World Cup 2026</p>
        <h1>Bracket Picker</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const name = value.trim()
            if (name) {
              onSave(name)
            }
          }}
        >
          <label htmlFor="nickname">Your name or nickname</label>
          <input
            id="nickname"
            autoComplete="name"
            inputMode="text"
            maxLength={28}
            placeholder="Siuuuuu"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={!value.trim()}>
            Start picking
          </button>
        </form>
      </section>
    </main>
  )
}

function PickerScreen({
  nickname,
  picks,
  currentMatchId,
  animating,
  onPick,
  onBack,
  onShare,
}: {
  nickname: string
  picks: Picks
  currentMatchId: MatchId
  animating: boolean
  onPick: (teamCode: string) => void
  onBack: () => void
  onShare: () => void
}) {
  const match = matches[currentMatchId]
  const [teamA, teamB] = resolveMatchTeams(match, picks)
  const selectedCode = picks[currentMatchId]
  const completed = pickOrder.filter((matchId) => picks[matchId]).length

  if (!teamA || !teamB) {
    return null
  }

  return (
    <main className="app-screen picker-screen">
      <header className="top-bar">
        <button className="icon-button" type="button" onClick={onBack} aria-label="Back">
          {'<'}
        </button>
        <div>
          <span>{nickname}</span>
          <strong>
            {completed}/{pickOrder.length}
          </strong>
        </div>
        <button className="icon-button" type="button" onClick={onShare} aria-label="Open QR">
          QR
        </button>
      </header>

      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${(completed / pickOrder.length) * 100}%` }} />
      </div>

      <section className={`match-card ${animating ? 'leaving' : 'entering'}`} key={currentMatchId}>
        <p className="round-pill">{roundLabels[match.round]}</p>
        <h1>Pick winner</h1>
        <div className="match-options">
          <TeamOption team={teamA} selected={selectedCode === teamA.code} onPick={() => onPick(teamA.code)} />
          <TeamOption team={teamB} selected={selectedCode === teamB.code} onPick={() => onPick(teamB.code)} />
        </div>
      </section>
    </main>
  )
}

function ChampionScreen({
  nickname,
  picks,
  downloading,
  onDownload,
  onReset,
  onShare,
  onBack,
}: {
  nickname: string
  picks: Picks
  downloading: boolean
  onDownload: () => void
  onReset: () => void
  onShare: () => void
  onBack: () => void
}) {
  const champion = getWinner('M104', picks)

  return (
    <main className="app-screen champion-screen">
      <header className="top-bar">
        <button className="icon-button" type="button" onClick={onBack} aria-label="Back">
          {'<'}
        </button>
        <div>
          <span>{nickname}</span>
          <strong>Complete</strong>
        </div>
        <button className="icon-button" type="button" onClick={onShare} aria-label="Open QR">
          QR
        </button>
      </header>

      <section className="champion-card">
        <p className="eyebrow">Champion</p>
        <div className="champion-flag" aria-hidden="true">
          {champion?.flag}
        </div>
        <h1>{champion?.code}</h1>
        <p>{champion?.name}</p>
      </section>

      <div className="action-stack">
        <button className="primary-button" type="button" onClick={onDownload} disabled={downloading}>
          {downloading ? 'Creating PNG...' : 'Download PNG'}
        </button>
        <button className="secondary-button" type="button" onClick={onShare}>
          QR / share
        </button>
        <button className="ghost-button" type="button" onClick={onReset}>
          Start over
        </button>
      </div>
    </main>
  )
}

function ShareScreen({ onBack }: { onBack: () => void }) {
  const [qrUrl, setQrUrl] = useState('')
  const shareUrl = useMemo(getShareUrl, [])

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 290,
      color: {
        dark: '#041544',
        light: '#ffffff',
      },
    }).then(setQrUrl)
  }, [shareUrl])

  return (
    <main className="app-screen share-screen">
      <header className="top-bar">
        <button className="icon-button" type="button" onClick={onBack} aria-label="Back">
          {'<'}
        </button>
        <div>
          <span>Share</span>
          <strong>QR code</strong>
        </div>
        <span />
      </header>

      <section className="share-card">
        <p className="eyebrow">Scan to pick</p>
        {qrUrl ? <img src={qrUrl} width="290" height="290" alt="QR code for bracket picker" /> : <div className="qr-loading" />}
        <p className="share-url">{shareUrl}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(shareUrl)
          }}
        >
          Copy link
        </button>
      </section>
    </main>
  )
}

function App() {
  const [nickname, setNickname] = useState(readNickname)
  const [picks, setPicks] = useState<Picks>(readPicks)
  const [view, setView] = useState<View>(getInitialView)
  const [currentMatchId, setCurrentMatchId] = useState<MatchId | null>(() => getFirstOpenMatch(readPicks()))
  const [animating, setAnimating] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    localStorage.setItem(PICKS_KEY, JSON.stringify(picks))
  }, [picks])

  useEffect(() => {
    if (nickname) {
      localStorage.setItem(NICKNAME_KEY, nickname)
    }
  }, [nickname])

  useEffect(() => {
    const onPop = () => setView(getInitialView())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openPicker = () => {
    setView('picker')
    saveRoute('picker')
  }

  const openShare = () => {
    setView('share')
    saveRoute('share')
  }

  const onPick = (teamCode: string) => {
    if (!currentMatchId || animating) {
      return
    }

    const next = {
      ...clearDependents(currentMatchId, picks),
      [currentMatchId]: teamCode,
    }

    setPicks(next)
    setAnimating(true)

    window.setTimeout(() => {
      setCurrentMatchId(getFirstOpenMatch(next))
      setAnimating(false)
    }, transitionMs)
  }

  const onBack = () => {
    if (!currentMatchId) {
      setCurrentMatchId(getLastPickedMatch(picks))
      return
    }

    const currentIndex = pickOrder.indexOf(currentMatchId)
    const previous = pickOrder
      .slice(0, Math.max(currentIndex, 0))
      .reverse()
      .find((matchId) => picks[matchId] && isReady(matchId, picks))

    if (previous) {
      setCurrentMatchId(previous)
    }
  }

  const reset = () => {
    setPicks({})
    setCurrentMatchId(getFirstOpenMatch({}))
  }

  const hasFinished = Boolean(getWinner('M104', picks)) && !currentMatchId

  if (!nickname && view === 'picker') {
    return <NicknameScreen onSave={setNickname} />
  }

  if (view === 'share') {
    return <ShareScreen onBack={openPicker} />
  }

  if (hasFinished) {
    return (
      <ChampionScreen
        nickname={nickname}
        picks={picks}
        downloading={downloading}
        onBack={onBack}
        onReset={reset}
        onShare={openShare}
        onDownload={() => {
          setDownloading(true)
          downloadBracketPng(nickname, picks).finally(() => setDownloading(false))
        }}
      />
    )
  }

  return (
    <PickerScreen
      nickname={nickname}
      picks={picks}
      currentMatchId={currentMatchId ?? getFirstOpenMatch(picks) ?? 'M73'}
      animating={animating}
      onBack={onBack}
      onPick={onPick}
      onShare={openShare}
    />
  )
}

export default App
