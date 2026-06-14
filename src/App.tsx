import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ToolsSection from './sections/ToolsSection';
import IdeasSection from './sections/IdeasSection';
import ContactSection from './sections/ContactSection';
import FoodMapSection from './sections/FoodMapSection';
import Footer from './sections/Footer';
import { EditableDataProvider } from './context/EditableDataContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { PageProvider, usePage } from './context/PageContext';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const lenisRef = useRef<Lenis | null>(null);
  const { page } = usePage();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  useEffect(() => {
    const parallaxElements = document.querySelectorAll('[data-memphis-parallax]');
    parallaxElements.forEach((el) => {
      const speed = parseFloat((el as HTMLElement).dataset.memphisParallax || '0');
      gsap.fromTo(el, { y: speed * -50 }, {
        y: speed * 50, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  return (
    <ViewModeProvider>
      <EditableDataProvider>
        <Navbar />
        <main>
          {page === 'home' ? (
            <>
              <HeroSection />
              <div style={{ position: 'relative' }}>
                <div className="memphis-float memphis-float--triangle" data-memphis-parallax="0.3" style={{ top: -30, left: '10%', '--float-duration': '20s', '--float-delay': '0s', '--float-distance': '-20px' } as React.CSSProperties} />
                <AboutSection />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="memphis-float memphis-float--circle" data-memphis-parallax="-0.2" style={{ top: 20, right: '8%', '--float-duration': '22s', '--float-delay': '2s', '--float-distance': '-18px', background: 'var(--memphis-yellow)' } as React.CSSProperties} />
                <ToolsSection />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="memphis-float memphis-float--zigzag" data-memphis-parallax="0.15" style={{ top: -20, left: '5%', '--float-duration': '24s', '--float-delay': '1s', '--float-distance': '-22px' } as React.CSSProperties} />
                <IdeasSection />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="memphis-float" data-memphis-parallax="-0.25" style={{ top: 40, right: '12%', width: 50, height: 50, background: 'var(--memphis-primary)', borderRadius: '50%', border: '2px solid #000', opacity: 0.3, '--float-duration': '18s', '--float-delay': '3s', '--float-distance': '-16px' } as React.CSSProperties} />
                <ContactSection />
              </div>
              <Footer />
            </>
          ) : (
            <FoodMapSection />
          )}
        </main>
        <AdminPanel />
      </EditableDataProvider>
    </ViewModeProvider>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <PageProvider>
        <AppContent />
      </PageProvider>
    </DarkModeProvider>
  );
}
