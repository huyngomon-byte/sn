import { useEffect, useMemo, useRef, useState } from 'react'

type TimeLeft = {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

const UNLOCK_AT = '2026-03-29T16:50:00'
const BIRTHDAY_NAME = 'Bé Iu'
const LOCK_TITLE = 'Chưa đến giờ đâu ❤️'
const LOCK_SUBTITLE = 'Quay lại sau nhé 💖'
const WISH_TITLE = 'Chúc mừng sinh nhật'
const MESSAGE_LINES = [
  'Chúc em tuổi mới luôn vui vẻ,',
  'luôn xinh đẹp và luôn ở bên anh ❤️',
]
const MUSIC_HINT = 'Chạm vào màn hình để bật nhạc nhé ❤️'

const hearts = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${6 + index * 6.8}%`,
  duration: `${10 + (index % 5) * 2}s`,
  delay: `${(index % 6) * 1.1}s`,
  size: `${18 + (index % 4) * 8}px`,
}))

const calculateTimeLeft = (): TimeLeft => {
  const now = new Date().getTime()
  const target = new Date(UNLOCK_AT).getTime()
  const diff = target - now

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const pad = (value: number) => value.toString().padStart(2, '0')

function App() {
  const isPreviewMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('preview') === '1'

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)
  const [isUnlocked, setIsUnlocked] = useState(
    () => isPreviewMode || new Date() >= new Date(UNLOCK_AT),
  )
  const [showTapHint, setShowTapHint] = useState(false)
  const [photoSrc, setPhotoSrc] = useState('/couple-photo.webp')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextTimeLeft = calculateTimeLeft()
      setTimeLeft(nextTimeLeft)

      if (isPreviewMode || nextTimeLeft.total <= 0) {
        setIsUnlocked(true)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isPreviewMode])

  useEffect(() => {
    if (!isUnlocked || !audioRef.current) return

    const tryPlay = async () => {
      try {
        await audioRef.current?.play()
        setShowTapHint(false)
      } catch {
        setShowTapHint(true)
      }
    }

    void tryPlay()
  }, [isUnlocked])

  useEffect(() => {
    if (!showTapHint || !audioRef.current) return

    const handleFirstInteraction = () => {
      void audioRef.current?.play()
      setShowTapHint(false)
    }

    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [showTapHint])

  const countdown = useMemo(() => {
    const dayPart = timeLeft.days > 0 ? `${pad(timeLeft.days)} : ` : ''
    return `${dayPart}${pad(timeLeft.hours)} : ${pad(timeLeft.minutes)} : ${pad(timeLeft.seconds)}`
  }, [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Parisienne&display=swap');

        :root {
          font-family: 'Cormorant Garamond', serif;
          color: #fff7fb;
          background:
            radial-gradient(circle at top, rgba(255, 196, 222, 0.25), transparent 34%),
            radial-gradient(circle at bottom right, rgba(255, 151, 196, 0.18), transparent 30%),
            linear-gradient(180deg, #12070f 0%, #2b0d24 48%, #5b1c43 100%);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          min-height: 100%;
          margin: 0;
        }

        body {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top, rgba(255, 196, 222, 0.25), transparent 34%),
            radial-gradient(circle at bottom right, rgba(255, 151, 196, 0.18), transparent 30%),
            linear-gradient(180deg, #12070f 0%, #2b0d24 48%, #5b1c43 100%);
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          isolation: isolate;
        }

        .glow {
          position: absolute;
          inset: auto;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          filter: blur(18px);
          opacity: 0.42;
          z-index: -1;
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .glow.top {
          top: 8%;
          left: -40px;
          background: rgba(255, 172, 208, 0.28);
        }

        .glow.bottom {
          right: -60px;
          bottom: 6%;
          background: rgba(255, 225, 235, 0.16);
          animation-delay: -2.5s;
        }

        .card {
          width: min(100%, 420px);
          border: 1px solid rgba(255, 238, 245, 0.16);
          border-radius: 30px;
          padding: 30px 24px;
          text-align: center;
          background: rgba(33, 11, 28, 0.62);
          backdrop-filter: blur(20px);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
        }

        .lock-card {
          animation: fadeUp 1s ease both;
        }

        .eyebrow {
          margin: 0 0 12px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 228, 238, 0.74);
        }

        .lock-title {
          margin: 0;
          font-family: 'Parisienne', cursive;
          font-size: clamp(2.9rem, 10vw, 4rem);
          font-weight: 400;
          line-height: 1.02;
          color: #fff2f8;
          animation: softPulse 2.4s ease-in-out infinite;
        }

        .countdown {
          margin: 18px 0 10px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: clamp(1.2rem, 6vw, 2rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffd8e8;
        }

        .unlock-text {
          margin: 0;
          font-size: 1.14rem;
          color: rgba(255, 235, 243, 0.88);
        }

        .main {
          width: min(100%, 430px);
          text-align: center;
          animation: fadeUp 1.25s ease both;
        }

        .preview-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 218, 231, 0.26);
          border-radius: 999px;
          background: rgba(255, 231, 239, 0.12);
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffe2ee;
        }

        .photo-wrap {
          position: relative;
          margin: 0 auto 24px;
          width: min(76vw, 280px);
          animation: fadeUp 1s ease both 0.2s;
          animation-fill-mode: both;
        }

        .photo-wrap::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(255, 195, 221, 0.5), rgba(255, 255, 255, 0.08));
          filter: blur(14px);
          z-index: -1;
        }

        .photo {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          border-radius: 26px;
          border: 1px solid rgba(255, 244, 248, 0.16);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
          animation: photoFloat 5s ease-in-out infinite;
        }

        .wish-line {
          margin: 0;
          font-size: clamp(1.7rem, 7vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: #fff2f7;
          text-shadow: 0 6px 22px rgba(255, 146, 195, 0.14);
          opacity: 0;
          animation: fadeLine 0.85s ease forwards;
        }

        .wish-line.delay-1 {
          animation-delay: 0.95s;
        }

        .message {
          margin: 20px auto 0;
          width: min(100%, 336px);
        }

        .message-line {
          margin: 0 0 10px;
          font-size: 1.16rem;
          line-height: 1.72;
          color: rgba(255, 239, 245, 0.94);
          opacity: 0;
          transform: translateY(12px);
          animation: fadeLine 0.85s ease forwards;
        }

        .message-line.delay-3 {
          animation-delay: 1.55s;
        }

        .message-line.delay-4 {
          animation-delay: 1.85s;
        }

        .music-hint {
          margin-top: 18px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.92rem;
          color: rgba(255, 223, 234, 0.9);
          opacity: 0;
          animation: fadeLine 0.7s ease forwards 2.2s;
        }

        .heart-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -2;
        }

        .heart {
          position: absolute;
          bottom: -40px;
          color: rgba(255, 193, 218, 0.44);
          animation-name: driftHeart;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          text-shadow: 0 0 20px rgba(255, 180, 211, 0.3);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLine {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.025);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.34;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.55;
          }
        }

        @keyframes photoFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.018);
          }
        }

        @keyframes driftHeart {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate3d(24px, -115vh, 0) scale(1.18);
            opacity: 0;
          }
        }

        @media (min-width: 768px) {
          .page {
            padding: 40px;
          }

          .card {
            padding: 34px 30px;
          }
        }
      `}</style>

      <div className="page">
        <div className="glow top" />
        <div className="glow bottom" />

        <div className="heart-layer" aria-hidden="true">
          {hearts.map((heart) => (
            <span
              key={heart.id}
              className="heart"
              style={{
                left: heart.left,
                animationDuration: heart.duration,
                animationDelay: heart.delay,
                fontSize: heart.size,
              }}
            >
              {'❤'}
            </span>
          ))}
        </div>

        {!isUnlocked ? (
          <section className="card lock-card">
            <p className="eyebrow">Secret Birthday Countdown</p>
            <h1 className="lock-title">{LOCK_TITLE}</h1>
            <div className="countdown">{countdown}</div>
            <p className="unlock-text">{LOCK_SUBTITLE}</p>
          </section>
        ) : (
          <main className="main">
            {isPreviewMode ? <div className="preview-pill">Preview Mode</div> : null}

            <div className="photo-wrap">
              <img
                className="photo"
                src={photoSrc}
                alt={`Happy birthday ${BIRTHDAY_NAME}`}
                onError={() => setPhotoSrc('/birthday-photo.svg')}
              />
            </div>

            <p className="wish-line delay-1">
              {WISH_TITLE} {BIRTHDAY_NAME} {'❤️'}
            </p>

            <div className="message">
              <p className="message-line delay-3">{MESSAGE_LINES[0]}</p>
              <p className="message-line delay-4">{MESSAGE_LINES[1]}</p>
            </div>

            {showTapHint ? <p className="music-hint">{MUSIC_HINT}</p> : null}
          </main>
        )}

        <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      </div>
    </>
  )
}

export default App
