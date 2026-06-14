import MemphisBackground from '../components/MemphisBackground';
import { useEditableData } from '../context/EditableDataContext';

export default function HeroSection() {
  const { data } = useEditableData();
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: 'var(--color-bg)',
      }}
    >
      <MemphisBackground density={50} />

      <div className="memphis-float memphis-float--triangle" style={{
        top: '15%', left: '8%',
        '--float-duration': '20s', '--float-delay': '0s', '--float-distance': '-25px',
      } as React.CSSProperties} />
      <div className="memphis-float memphis-float--circle" style={{
        top: '25%', right: '12%',
        '--float-duration': '22s', '--float-delay': '3s', '--float-distance': '-18px',
        background: 'var(--memphis-yellow)',
      } as React.CSSProperties} />
      <div className="memphis-float memphis-float--zigzag" style={{
        bottom: '20%', left: '15%',
        '--float-duration': '18s', '--float-delay': '5s', '--float-distance': '-15px',
      } as React.CSSProperties} />

      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 16, padding: '0 20px',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(48px, 10vw, 96px)', color: 'var(--memphis-primary)',
          transform: 'rotate(-2deg)', textShadow: '4px 4px 0 #000',
          letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
        }}>
          {data.profile.brand.name}
        </h1>

        {/* Three Piggy Pals */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <img src="/piggy-purple.jpg" alt="紫色猪猪侠" style={{
            width: 64, height: 64, borderRadius: 12, border: '3px solid #000',
            objectFit: 'cover', boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
            animation: 'skillFloat 3.2s ease-in-out infinite',
          }} />
          <img src="/piggy.jpg" alt="猪猪侠" style={{
            width: 72, height: 72, borderRadius: 12, border: '3px solid #000',
            objectFit: 'cover', boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
            animation: 'skillFloat 3s ease-in-out infinite',
          }} />
          <img src="/piggy-yellow.jpg" alt="黄色猪猪侠" style={{
            width: 64, height: 64, borderRadius: 12, border: '3px solid #000',
            objectFit: 'cover', boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
            animation: 'skillFloat 2.8s ease-in-out infinite 0.5s',
          }} />
        </div>

        {/* Tagline - from editable data */}
        <div style={{
          position: 'relative', padding: '16px 32px',
          background: 'var(--memphis-teal)', border: '3px solid #000',
          borderRadius: 12, transform: 'rotate(1deg)',
        }}>
          <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: 'absolute', top: -6, left: 0, width: '100%', height: 12 }}>
            <path d="M0,6 Q12,0 24,6 T48,6 T72,6 T96,6 T120,6 T144,6 T168,6 T192,6 T200,6" fill="none" stroke="#000" strokeWidth="2" />
          </svg>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 'clamp(14px, 2.5vw, 20px)', color: '#fff',
            textShadow: '2px 2px 0 rgba(0,0,0,0.3)', margin: 0, letterSpacing: '0.02em',
          }}>
            {data.profile.brand.tagline}
          </p>
          <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 12 }}>
            <path d="M0,6 Q12,12 24,6 T48,6 T72,6 T96,6 T120,6 T144,6 T168,6 T192,6 T200,6" fill="none" stroke="#000" strokeWidth="2" />
          </svg>
        </div>

        <button onClick={scrollToAbout} style={{
          marginTop: 40, width: 48, height: 48, borderRadius: '50%',
          background: 'var(--memphis-yellow)', border: '3px solid #000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', animation: 'bounceDown 2s ease-in-out infinite',
          boxShadow: '3px 3px 0 #000',
        }} aria-label="向下滚动">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </section>
  );
}
