import { useEffect, useMemo, useRef, useState } from 'react'

type TimeLeft = {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

const UNLOCK_AT = '2026-04-16T00:00:00'
const BIRTHDAY_NAME = 'Bé Iu'

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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)
  const [isUnlocked, setIsUnlocked] = useState(() => new Date() >= new Date(UNLOCK_AT))
  const [showTapHint, setShowTapHint] = useState(false)
  const [photoSrc, setPhotoSrc] = useState('/couple-photo.jpg')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextTimeLeft = calculateTimeLeft()
      setTimeLeft(nextTimeLeft)

      if (nextTimeLeft.total <= 0) {
        setIsUnlocked(true)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

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
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&family=Parisienne&display=swap');

        :root {
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #fff5fb;
          background:
            radial-gradient(circle at top, rgba(255, 148, 196, 0.2), transparent 36%),
            linear-gradient(180deg, #09040d 0%, #170816 45%, #3e0f31 100%);
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
            radial-gradient(circle at top, rgba(255, 148, 196, 0.2), transparent 36%),
            linear-gradient(180deg, #09040d 0%, #170816 45%, #3e0f31 100%);
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
          filter: blur(16px);
          opacity: 0.42;
          z-index: -1;
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .glow.top {
          top: 8%;
          left: -40px;
          background: rgba(255, 120, 180, 0.22);
        }

        .glow.bottom {
          right: -60px;
          bottom: 6%;
          background: rgba(255, 184, 214, 0.18);
          animation-delay: -2.5s;
        }

        .card {
          width: min(100%, 420px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 28px 22px;
          text-align: center;
          background: rgba(17, 7, 18, 0.64);
          backdrop-filter: blur(18px);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
        }

        .lock-card {
          animation: fadeUp 1s ease both;
        }

        .eyebrow {
          margin: 0 0 10px;
          font-size: 0.86rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 211, 229, 0.72);
        }

        .lock-title {
          margin: 0;
          font-size: clamp(2.2rem, 8vw, 3.2rem);
          font-weight: 800;
          line-height: 1.05;
          animation: softPulse 2.4s ease-in-out infinite;
        }

        .countdown {
          margin: 18px 0 10px;
          font-size: clamp(1.4rem, 7vw, 2.4rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffd7e9;
        }

        .unlock-text {
          margin: 0;
          font-size: 0.98rem;
          color: rgba(255, 232, 242, 0.78);
        }

        .main {
          width: min(100%, 430px);
          text-align: center;
          animation: fadeUp 1.25s ease both;
        }

        .photo-wrap {
          position: relative;
          margin: 0 auto 22px;
          width: min(76vw, 280px);
          animation: fadeUp 1s ease both 0.2s;
          animation-fill-mode: both;
        }

        .photo-wrap::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(255, 180, 213, 0.45), rgba(255, 255, 255, 0.08));
          filter: blur(12px);
          z-index: -1;
        }

        .photo {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
          animation: photoFloat 5s ease-in-out infinite;
        }

        .title-script {
          margin: 0 0 10px;
          font-family: 'Parisienne', cursive;
          font-size: clamp(2.2rem, 10vw, 3.8rem);
          color: #ffe0ee;
          opacity: 0;
          animation: fadeLine 0.9s ease forwards 0.6s;
        }

        .wish-line {
          margin: 0;
          font-size: clamp(1.55rem, 6.5vw, 2.4rem);
          font-weight: 800;
          line-height: 1.2;
          opacity: 0;
          animation: fadeLine 0.85s ease forwards;
        }

        .wish-line.delay-1 {
          animation-delay: 0.95s;
        }

        .wish-line.delay-2 {
          animation-delay: 1.25s;
        }

        .message {
          margin: 18px auto 0;
          width: min(100%, 330px);
        }

        .message-line {
          margin: 0 0 8px;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 236, 244, 0.9);
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

        .message-line.delay-5 {
          animation-delay: 2.15s;
        }

        .music-hint {
          margin-top: 18px;
          font-size: 0.92rem;
          color: rgba(255, 216, 231, 0.85);
          opacity: 0;
          animation: fadeLine 0.7s ease forwards 2.45s;
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
          color: rgba(255, 182, 211, 0.38);
          animation-name: driftHeart;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          text-shadow: 0 0 20px rgba(255, 165, 204, 0.28);
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
              ❤
            </span>
          ))}
        </div>

        {!isUnlocked ? (
          <section className="card lock-card">
            <p className="eyebrow">Secret Birthday Countdown</p>
            <h1 className="lock-title">Chưa đến giờ đâu 😏</h1>
            <div className="countdown">{countdown}</div>
            <p className="unlock-text">Quay lại sau nhé 💖</p>
          </section>
        ) : (
          <main className="main">
            <div className="photo-wrap">
              <img
                className="photo"
                src={photoSrc}
                alt={`Happy birthday ${BIRTHDAY_NAME}`}
                onError={() => setPhotoSrc('/birthday-photo.svg')}
              />
            </div>

            <h2 className="title-script">For {BIRTHDAY_NAME}</h2>
            <p className="wish-line delay-1">Chúc mừng sinh nhật {BIRTHDAY_NAME} 💖</p>
            <p className="wish-line delay-2">Tuổi mới thật dịu dàng và rực rỡ nhé</p>

            <div className="message">
              <p className="message-line delay-3">Chúc em tuổi mới luôn vui vẻ,</p>
              <p className="message-line delay-4">luôn xinh đẹp và luôn ở bên anh 😏</p>
              <p className="message-line delay-5">
                Cảm ơn vì đã xuất hiện trong cuộc đời anh.
              </p>
            </div>

            {showTapHint ? (
              <p className="music-hint">Chạm vào màn hình để bật nhạc nhé 💞</p>
            ) : null}
          </main>
        )}

        <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      </div>
    </>
  )
}

export default App
