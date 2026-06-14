import { useState, useEffect, useCallback } from 'react';
import { usePage } from '../context/PageContext';
import { useEditableData } from '../context/EditableDataContext';

const NAV_ITEMS = [
  { label: '关于', href: '#about' },
  { label: '工具箱', href: '#tools' },
  { label: '想法墙', href: '#ideas' },
  { label: '联系', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { page, setPage } = usePage();
  const { isAdmin } = useEditableData();

  const handleScroll = useCallback(() => {
    const sections = NAV_ITEMS.map((item) => {
      const el = document.querySelector(item.href);
      if (!el) return { id: item.href, top: Infinity };
      const rect = el.getBoundingClientRect();
      return { id: item.href, top: rect.top };
    });

    const current = sections.reduce((closest, section) => {
      if (section.top <= 120 && section.top > closest.top) return section;
      return closest;
    }, { id: '', top: -Infinity });

    if (current.id) {
      setActiveSection(current.id);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(250, 250, 250, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid #000',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 24,
              color: 'var(--memphis-primary)',
              transform: 'rotate(-2deg)',
              display: 'inline-block',
              textDecoration: 'none',
              textShadow: '2px 2px 0 #000',
              letterSpacing: '-0.02em',
            }}
          >
            dt1998
          </a>

          {/* Desktop Nav */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = activeSection === item.href;
              const rotations = [-1, 1, -0.5, 0.5];
              const radii = [20, 8, 16, 12];
              return (
                <button
                  key={item.href}
                  onClick={() => { setPage('home'); scrollTo(item.href); }}
                  style={{
                    padding: '8px 20px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 14,
                    border: '2px solid #000',
                    borderRadius: radii[i],
                    background: isActive ? 'var(--memphis-primary)' : '#fff',
                    color: isActive ? '#fff' : 'var(--color-text)',
                    transform: `rotate(${rotations[i]}deg)${isActive ? ' translateY(-2px)' : ''}`,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                    boxShadow: isActive ? '3px 3px 0 #000' : 'none',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            {/* Admin-only food map link */}
            {isAdmin && (
              <button
                onClick={() => { setPage('foodmap'); setMobileOpen(false); }}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 14,
                  border: '2px solid #000',
                  borderRadius: 10,
                  background: page === 'foodmap' ? 'var(--memphis-yellow)' : '#fff',
                  color: '#000',
                  transform: `rotate(0.5deg)${page === 'foodmap' ? ' translateY(-2px)' : ''}`,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  boxShadow: page === 'foodmap' ? '3px 3px 0 #000' : 'none',
                }}
              >
                🍜 美食地图
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: 40,
              height: 40,
              border: '2px solid #000',
              borderRadius: 8,
              background: mobileOpen ? 'var(--memphis-primary)' : '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <span style={{
              width: 20,
              height: 2,
              background: mobileOpen ? '#fff' : '#000',
              transition: 'all 0.3s',
              transform: mobileOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
            }} />
            <span style={{
              width: 20,
              height: 2,
              background: mobileOpen ? '#fff' : '#000',
              transition: 'all 0.3s',
              opacity: mobileOpen ? 0 : 1,
            }} />
            <span style={{
              width: 20,
              height: 2,
              background: mobileOpen ? '#fff' : '#000',
              transition: 'all 0.3s',
              transform: mobileOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
            }} />
          </button>
        </div>

        {/* Wave border bottom */}
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: 8,
            display: 'block',
            marginTop: -1,
          }}
        >
          <path
            d="M0,6 Q30,0 60,6 T120,6 T180,6 T240,6 T300,6 T360,6 T420,6 T480,6 T540,6 T600,6 T660,6 T720,6 T780,6 T840,6 T900,6 T960,6 T1020,6 T1080,6 T1140,6 T1200,6"
            fill="none"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'var(--memphis-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            paddingTop: 80,
          }}
        >
          {NAV_ITEMS.map((item, i) => {
            const colors = ['var(--memphis-yellow)', 'var(--memphis-teal)', 'var(--memphis-blue)', '#fff'];
            return (
              <button
                key={item.href}
                onClick={() => { setPage('home'); scrollTo(item.href); }}
                style={{
                  padding: '16px 48px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 24,
                  border: '3px solid #000',
                  background: colors[i],
                  color: '#000',
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)`,
                  cursor: 'pointer',
                  boxShadow: '6px 6px 0 #000',
                }}
              >
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => { setPage('foodmap'); setMobileOpen(false); }}
              style={{
                padding: '16px 48px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 24,
                border: '3px solid #000',
                background: '#FFCE5C',
                color: '#000',
                transform: 'rotate(2deg)',
                cursor: 'pointer',
                boxShadow: '6px 6px 0 #000',
              }}
            >
              🍜 美食地图
            </button>
          )}
        </div>
      )}
    </>
  );
}
