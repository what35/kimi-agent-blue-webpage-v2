import { useState, useEffect, useRef } from 'react';
import { useEditableData } from '../context/EditableDataContext';
import type { Tool } from '../data/siteData';
import ToolModal from '../components/ToolModal';

function DeviceCard({
  tool,
  index,
  onClick,
}: {
  tool: Tool;
  index: number;
  onClick: (tool: Tool) => void;
}) {
  const cardStyle = {
    '--device-primary': tool.memphis.primary,
    '--device-accent': tool.memphis.accent,
    '--start-rotate': `${(index % 2 === 0 ? -1 : 1)}deg`,
    transitionDelay: `${index * 0.1}s`,
  } as React.CSSProperties;

  return (
    <div
      className="memphis-device scroll-reveal"
      style={cardStyle}
      onClick={() => onClick(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(tool);
      }}
    >
      {/* Top: Screws + Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 6px',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="memphis-screw" />
          <div className="memphis-screw" />
        </div>
        {tool.memphis.badge && (
          <span className="memphis-badge">{tool.memphis.badge}</span>
        )}
      </div>

      {/* Middle: Screen / Cover Image */}
      <div style={{
        margin: '0 14px',
        border: '3px solid #000',
        borderRadius: 4,
        overflow: 'hidden',
        aspectRatio: '16/9',
        background: '#f0f0f0',
      }}>
        <img
          src={tool.media.cover}
          alt={tool.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Bottom: Device Panel */}
      <div style={{
        padding: '14px 16px 12px',
        borderTop: `2px dashed ${tool.memphis.primary}40`,
        marginTop: 8,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          margin: '0 0 6px',
          color: 'var(--color-text)',
        }}>
          {tool.name}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: '#666',
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}>
          {tool.tagline}
        </p>

        {/* Version + LEDs + Wave border */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <span className="version-tag">v{tool.download.version}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="memphis-led" />
            <div className="memphis-led" />
            <svg width="40" height="10" viewBox="0 0 40 10" style={{ marginLeft: 4 }}>
              <path
                d="M0,5 Q5,0 10,5 T20,5 T30,5 T40,5"
                fill="none"
                stroke={tool.memphis.primary}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealEls = sectionRef.current?.querySelectorAll('.scroll-reveal');
    revealEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const { data } = useEditableData();

  const openTool = (tool: Tool) => {
    setSelectedTool(tool);
    setModalOpen(true);
  };

  const closeTool = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTool(null), 300);
  };

  return (
    <>
      <section
        id="tools"
        ref={sectionRef}
        style={{
          position: 'relative',
          padding: '140px 24px 120px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div className="scroll-reveal" style={{ '--start-rotate': '2deg' } as React.CSSProperties}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(40px, 6vw, 64px)',
            color: 'var(--memphis-yellow)',
            transform: 'rotate(2deg)',
            marginBottom: 12,
            textShadow: '3px 3px 0 #000',
            display: 'inline-block',
          }}>
            工具箱
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: '#666',
            maxWidth: 480,
            lineHeight: 1.6,
            marginBottom: 48,
          }}>
            每一台都是一个小而美的数字机器，点击卡片查看完整说明书
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: '#999',
          }}>
            不定时更新
          </p>
        </div>

        {/* Device Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 28,
        }}>
          {data.tools.map((tool, i) => (
            <DeviceCard
              key={tool.id}
              tool={tool}
              index={i}
              onClick={openTool}
            />
          ))}
        </div>

        {/* Floating decorations */}
        <div className="memphis-float memphis-float--circle" style={{
          top: '8%', right: '3%',
          '--float-duration': '20s', '--float-delay': '2s', '--float-distance': '-18px',
          background: 'var(--memphis-blue)',
        } as React.CSSProperties} />
        <div className="memphis-float memphis-float--zigzag" style={{
          bottom: '15%', left: '2%',
          '--float-duration': '24s', '--float-delay': '4s', '--float-distance': '-22px',
        } as React.CSSProperties} />
      </section>

      <ToolModal
        tool={selectedTool}
        isOpen={modalOpen}
        onClose={closeTool}
      />
    </>
  );
}
