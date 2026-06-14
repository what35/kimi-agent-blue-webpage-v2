import { useState, useEffect, useRef } from 'react';
import { useEditableData } from '../context/EditableDataContext';
import type { Skill, Hobby, TimelineItem } from '../data/siteData';

/* ========== Tag Detail Modal ========== */
function TagDetailModal({
  title,
  detail,
  color,
  onClose,
}: {
  title: string;
  detail?: string;
  color: string;
  onClose: () => void;
}) {
  if (!detail) return null;
  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1001 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        style={{
          background: color,
          border: '3px solid #000',
          borderRadius: 12,
          maxWidth: 420,
          width: '90%',
          padding: '28px 24px',
          position: 'relative',
          transform: 'scale(1)',
          opacity: 1,
          transition: 'transform 0.3s var(--motion-ease), opacity 0.3s',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid #000',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          &times;
        </button>
        <h4 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          margin: '0 0 12px',
          color: '#fff',
          textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
        }}>
          {title}
        </h4>
        <div style={{
          padding: 14,
          background: 'rgba(255,255,255,0.5)',
          border: '1px dashed #000',
          borderRadius: 8,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            lineHeight: 1.7,
            color: '#1A1A1A',
            margin: 0,
          }}>
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========== Skill Tag ========== */
function SkillShape({ skill, index, onClick }: { skill: Skill; index: number; onClick: () => void }) {
  const renderShape = () => {
    switch (skill.shape) {
      case 'triangle':
        return <div style={{ width: 28, height: 28, background: skill.color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', border: '2px solid #000', flexShrink: 0 }} />;
      case 'circle':
        return <div style={{ width: 28, height: 28, background: skill.color, borderRadius: '50%', border: '2px solid #000', flexShrink: 0 }} />;
      case 'zigzag':
        return <div style={{ width: 28, height: 28, background: `repeating-linear-gradient(45deg, ${skill.color}, ${skill.color} 3px, transparent 3px, transparent 6px)`, border: '2px solid #000', flexShrink: 0 }} />;
      case 'wave':
        return <svg width="28" height="28" viewBox="0 0 28 28" style={{ flexShrink: 0 }}><rect width="28" height="28" fill={skill.color} stroke="#000" strokeWidth="2" rx="4" /><path d="M4,14 Q8,8 12,14 T20,14 T26,14" fill="none" stroke="#000" strokeWidth="2" /></svg>;
      case 'dot':
        return <div style={{ width: 20, height: 20, background: skill.color, borderRadius: '50%', border: '2px solid #000', flexShrink: 0 }} />;
      default:
        return null;
    }
  };
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: '#fff',
        border: '2px solid #000',
        borderRadius: 8,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--color-text)',
        animation: `skillFloat ${3 + index * 0.6}s ease-in-out infinite`,
        animationDelay: `${index * 0.3}s`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px) scale(1.05)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 0 #000';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {renderShape()}
      <span>{skill.name}</span>
    </div>
  );
}

/* ========== Hobby Tag ========== */
function HobbyTag({ hobby, index, onClick, onDelete, isAdmin }: {
  hobby: Hobby; index: number; onClick: () => void; onDelete: () => void; isAdmin: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: index % 2 === 0 ? 'var(--memphis-yellow)' : '#fff',
        border: '2px solid #000',
        borderRadius: index % 2 === 0 ? 20 : 8,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--color-text)',
        transform: `rotate(${(index % 3 - 1)}deg)`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) translateY(-3px) scale(1.05)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 0 #000';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = `rotate(${(index % 3 - 1)}deg)`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {hobby.name}
      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            width: 18, height: 18, borderRadius: '50%', border: '1px solid #000',
            background: 'rgba(255,100,100,0.3)', fontSize: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: 4,
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

/* ========== Timeline Node ========== */
function TimelineNode({ item, index, onClick }: { item: TimelineItem; index: number; onClick?: () => void }) {
  const isLeft = index % 2 === 0;
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexDirection: isLeft ? 'row' : 'row-reverse', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: isLeft ? 'flex-end' : 'flex-start' }}>
        <div
          onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.transform = `rotate(${(item.memphis.rotate ?? 0) + (isLeft ? -1 : 1)}deg) translateY(-3px)`; }}
          onMouseLeave={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.transform = `rotate(${item.memphis.rotate ?? 0}deg)`; }}
          style={{
            padding: '16px 20px', background: item.memphis.color, border: '2px solid #000',
            borderRadius: item.memphis.shape === 'circle' ? 50 : 10, maxWidth: 300, minWidth: 160,
            textAlign: isLeft ? 'right' : 'left', transform: `rotate(${item.memphis.rotate ?? 0}deg)`,
            overflow: 'hidden', transition: 'transform 0.3s',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>{item.year}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 4 }}>{item.title}</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.9)',
            marginTop: 2, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}>{item.desc}</div>
          {onClick && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>点击编辑</div>}
        </div>
      </div>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: item.memphis.color, border: '2px solid #000', flexShrink: 0, marginTop: 16, zIndex: 2 }} />
      <div style={{ flex: 1 }} />
    </div>
  );
}

function FutureNode() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexDirection: 'row-reverse' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ padding: '20px 28px', background: 'var(--memphis-primary)', border: '2px solid #000', borderRadius: '50%', minWidth: 100, textAlign: 'center', transform: 'rotate(3deg)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>?</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>未来</div>
        </div>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--memphis-primary)', border: '3px solid #000', flexShrink: 0, marginTop: 20, zIndex: 2, boxShadow: '0 0 0 4px rgba(79,140,255,0.3)' }} />
      <div style={{ flex: 1 }} />
    </div>
  );
}

/* ========== Main Section ========== */
/* ========== Timeline Edit Modal ========== */
function TimelineEditModal({
  item, onSave, onDelete, onClose,
}: {
  item: TimelineItem;
  onSave: (updated: TimelineItem) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [year, setYear] = useState(item.year);
  const [title, setTitle] = useState(item.title);
  const [desc, setDesc] = useState(item.desc);

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1001 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: item.memphis.color, border: '3px solid #000', borderRadius: 12,
        maxWidth: 400, width: '90%', padding: '24px 20px', position: 'relative',
        boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 10, right: 10, width: 32, height: 32,
          borderRadius: '50%', border: '2px solid #000', background: '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700,
        }}>&times;</button>

        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff', margin: '0 0 12px', textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
          编辑经历
        </h4>

        <div style={{ padding: 14, background: 'rgba(255,255,255,0.5)', border: '1px dashed #000', borderRadius: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>年份</label>
          <input value={year} onChange={(e) => setYear(e.target.value)} style={{
            width: '100%', padding: '6px 8px', border: '2px solid #000', borderRadius: 4,
            fontSize: 13, marginBottom: 8, boxSizing: 'border-box',
          }} />
          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>标题</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{
            width: '100%', padding: '6px 8px', border: '2px solid #000', borderRadius: 4,
            fontSize: 13, marginBottom: 8, boxSizing: 'border-box',
          }} />
          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>描述</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{
            width: '100%', padding: '6px 8px', border: '2px solid #000', borderRadius: 4,
            fontSize: 13, marginBottom: 8, boxSizing: 'border-box', resize: 'vertical',
          }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => { onSave({ ...item, year, title, desc }); onClose(); }} style={{
            flex: 1, padding: '8px', background: '#fff', border: '2px solid #000',
            borderRadius: 4, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>保存</button>
          <button onClick={() => { if (confirm('确定删除这条经历？')) { onDelete(); onClose(); } }} style={{
            flex: 1, padding: '8px', background: 'rgba(255,100,100,0.3)', border: '2px solid #000',
            borderRadius: 4, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: '#c00',
          }}>删除</button>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { data, isAdmin, updateHobbies, updateTimeline } = useEditableData();
  const sectionRef = useRef<HTMLElement>(null);
  const [showHobbyForm, setShowHobbyForm] = useState(false);
  const [newHobby, setNewHobby] = useState('');
  const [activeTag, setActiveTag] = useState<{ title: string; detail: string; color: string } | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const { profile } = data;

  // Auto-sort timeline ascending: oldest at bottom, newest near top
  const sortedTimeline = [...profile.timeline].sort((a, b) => parseInt(a.year) - parseInt(b.year));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); },
      { threshold: 0.1 }
    );
    const revealEls = sectionRef.current?.querySelectorAll('.scroll-reveal');
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    updateHobbies([...profile.hobbies, { name: newHobby.trim() }]);
    setNewHobby('');
    setShowHobbyForm(false);
  };

  const handleDeleteHobby = (index: number) => {
    updateHobbies(profile.hobbies.filter((_, i) => i !== index));
  };

  return (
    <section id="about" ref={sectionRef} style={{ position: 'relative', padding: '140px 24px 100px', maxWidth: 900, margin: '0 auto' }}>
      {/* Title */}
      <h2 className="scroll-reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--memphis-primary)', marginBottom: 48, textShadow: '3px 3px 0 #000', '--start-rotate': '-2deg' } as React.CSSProperties}>
        关于我
      </h2>

      {/* Profile Card */}
      <div className="scroll-reveal" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', '--start-rotate': '1deg' } as React.CSSProperties}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #000', overflow: 'hidden', background: 'var(--memphis-yellow)', flexShrink: 0, transition: 'border-radius 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', cursor: 'pointer' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderRadius = '16px'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderRadius = '50%'; }}>
          <img src={profile.avatar} alt="邓恬" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
        <div style={{ flex: 1, minWidth: 250 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--memphis-teal)', border: '2px solid #000', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 16, textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
            {profile.brand.signature}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>{profile.bio}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="scroll-reveal" style={{ marginBottom: 48, '--start-rotate': '-1deg' } as React.CSSProperties}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--memphis-purple)', marginBottom: 20 }}>技能标签</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {profile.skills.map((skill, i) => (
            <SkillShape
              key={skill.name}
              skill={skill}
              index={i}
              onClick={() => skill.detail && setActiveTag({ title: skill.name, detail: skill.detail, color: skill.color })}
            />
          ))}
        </div>
      </div>

      {/* Personal Hobbies */}
      <div className="scroll-reveal" style={{ marginBottom: 48, '--start-rotate': '1deg' } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--memphis-purple)', margin: 0 }}>个人爱好</h3>
          {isAdmin && !showHobbyForm && (
            <button onClick={() => setShowHobbyForm(true)} style={{ padding: '4px 12px', background: 'var(--memphis-primary)', color: '#fff', border: '2px solid #000', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer' }}>+</button>
          )}
        </div>

        {isAdmin && showHobbyForm && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, maxWidth: 400 }}>
            <input value={newHobby} onChange={(e) => setNewHobby(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddHobby()} placeholder="输入爱好..." style={{ flex: 1, padding: '8px 12px', border: '2px solid #000', borderRadius: 6, fontSize: 13 }} />
            <button onClick={handleAddHobby} style={{ padding: '8px 16px', background: 'var(--memphis-primary)', color: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>添加</button>
            <button onClick={() => setShowHobbyForm(false)} style={{ padding: '8px 12px', background: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>取消</button>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {profile.hobbies.map((hobby, i) => (
            <HobbyTag
              key={i}
              hobby={hobby}
              index={i}
              onClick={() => hobby.detail && setActiveTag({ title: hobby.name, detail: hobby.detail, color: i % 2 === 0 ? 'var(--memphis-yellow)' : 'var(--memphis-teal)' })}
              onDelete={() => handleDeleteHobby(i)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="scroll-reveal" style={{ marginBottom: 48, '--start-rotate': '1deg' } as React.CSSProperties}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--memphis-purple)', marginBottom: 24 }}>经历地图</h3>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundImage: 'repeating-linear-gradient(to bottom, #000 0px, #000 6px, transparent 6px, transparent 12px)', transform: 'translateX(-50%)' }} />
          {/* Timeline sorted ascending: oldest at top, newest at bottom, then future */}
          {sortedTimeline.map((item, i) => (
            <TimelineNode
              key={`${item.year}-${item.title}-${i}`}
              item={item}
              index={i}
              onClick={isAdmin ? () => setEditingTimeline(item) : undefined}
            />
          ))}
          {/* Future at bottom — time flows top-to-bottom: past → present → future */}
          <FutureNode />
        </div>
      </div>

      {/* Timeline Edit Modal */}
      {isAdmin && editingTimeline && (
        <TimelineEditModal
          item={editingTimeline}
          onSave={(updated) => {
            // Auto-sort after edit: replace then sort ascending
            const next = profile.timeline.map((t) =>
              t.year === editingTimeline.year && t.title === editingTimeline.title ? updated : t
            ).sort((a, b) => parseInt(a.year) - parseInt(b.year));
            updateTimeline(next);
            setEditingTimeline(null);
          }}
          onDelete={() => {
            const next = profile.timeline.filter((t) =>
              !(t.year === editingTimeline.year && t.title === editingTimeline.title)
            );
            updateTimeline(next);
            setEditingTimeline(null);
          }}
          onClose={() => setEditingTimeline(null)}
        />
      )}

      {/* Honors */}
      <div className="scroll-reveal" style={{ '--start-rotate': '-1deg' } as React.CSSProperties}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--memphis-primary)', marginBottom: 20 }}>荣誉墙</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {profile.honors.map((honor, i) => (
            <div key={i} style={{ padding: '8px 16px', background: i % 2 === 0 ? 'var(--memphis-primary)' : 'var(--memphis-teal)', border: '2px solid #000', borderRadius: i % 2 === 0 ? 20 : 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: '#fff', transform: `rotate(${(i % 3 - 1)}deg)`, textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
              {honor}
            </div>
          ))}
        </div>
      </div>

      {/* Tag Detail Modal */}
      {activeTag && (
        <TagDetailModal
          title={activeTag.title}
          detail={activeTag.detail}
          color={activeTag.color}
          onClose={() => setActiveTag(null)}
        />
      )}
    </section>
  );
}
