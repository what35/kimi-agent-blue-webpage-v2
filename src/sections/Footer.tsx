import { useDarkMode } from '../context/DarkModeContext';
import { useViewMode } from '../context/ViewModeContext';

export default function Footer() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { isGrid, toggleGrid } = useViewMode();

  return (
    <footer style={{ position: 'relative' }}>
      {/* Pattern border */}
      <div className="footer-pattern" />

      <div style={{
        background: 'var(--color-bg)',
        padding: '48px 24px 32px',
        textAlign: 'center',
      }}>
        {/* Main text */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(16px, 3vw, 22px)',
          color: 'var(--memphis-primary)',
          margin: '0 0 32px',
          letterSpacing: '0.05em',
        }}>
          好心态决定女人一生
        </p>

        {/* View mode controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}>
          {/* Night mode toggle */}
          <button
            onClick={toggleDark}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '2px solid #000',
              background: isDark ? 'var(--memphis-yellow)' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0 #000',
              transition: 'background 0.3s, transform 0.2s',
            }}
            title={isDark ? '切换日间模式' : '切换夜间模式'}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Grid mode toggle */}
          <button
            onClick={toggleGrid}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '2px solid #000',
              background: isGrid ? 'var(--memphis-primary)' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0 #000',
              transition: 'background 0.3s, transform 0.2s',
            }}
            title={isGrid ? '关闭网格线' : '开启网格线'}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isGrid ? '#fff' : '#000'} strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
