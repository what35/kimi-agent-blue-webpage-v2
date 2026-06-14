import { useState, useEffect, useRef } from 'react';
import { useEditableData } from '../context/EditableDataContext';
import type { Idea } from '../data/siteData';

const ALL_COLORS = [
  { hex: '#4F8CFF', name: '蓝' },
  { hex: '#FFCE5C', name: '黄' },
  { hex: '#86CCCA', name: '青' },
  { hex: '#5B6FA8', name: '紫' },
  { hex: '#FF71CE', name: '粉' },
  { hex: '#FF6B6B', name: '红' },
  { hex: '#90EE90', name: '绿' },
  { hex: '#FFA07A', name: '橙' },
];

const DEFAULT_TAGS = ['产品脑洞', '设计', '技术', '随笔'];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
      {ALL_COLORS.map((c) => (
        <button
          key={c.hex}
          onClick={() => onChange(c.hex)}
          title={c.name}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: c.hex,
            border: `3px solid ${value === c.hex ? '#000' : '#ccc'}`,
            cursor: 'pointer', boxShadow: value === c.hex ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none',
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function TagSelector({
  value, onChange, onAddTag, allTags,
}: {
  value: string; onChange: (t: string) => void; onAddTag: (t: string) => void; allTags: string[];
}) {
  const [newTag, setNewTag] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            style={{
              padding: '4px 12px', border: `2px solid ${value === tag ? '#000' : '#ccc'}`,
              borderRadius: 6, background: value === tag ? '#4F8CFF' : '#f5f5f5',
              color: value === tag ? '#fff' : '#666', fontFamily: 'var(--font-display)',
              fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </button>
        ))}
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{
            padding: '4px 10px', border: '2px dashed #999', borderRadius: 6,
            background: 'transparent', color: '#999', fontSize: 12, cursor: 'pointer',
          }}>+ 新标签</button>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              value={newTag} onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newTag.trim()) { onAddTag(newTag.trim()); onChange(newTag.trim()); setNewTag(''); setShowAdd(false); } }}
              placeholder="标签名" autoFocus
              style={{ padding: '4px 8px', border: '2px solid #000', borderRadius: 4, fontSize: 12, width: 80 }}
            />
            <button onClick={() => { if (newTag.trim()) { onAddTag(newTag.trim()); onChange(newTag.trim()); setNewTag(''); } setShowAdd(false); }} style={{ padding: '4px 8px', border: '2px solid #000', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}

function IdeaForm({
  initialData, onSave, onCancel,
}: {
  initialData?: Partial<Idea>;
  onSave: (data: { content: string; detail: string; category: string; color: string }) => void;
  onCancel: () => void;
}) {
  const { data } = useEditableData();
  const [content, setContent] = useState(initialData?.content || '');
  const [detail, setDetail] = useState(initialData?.detail || '');
  const [category, setCategory] = useState(initialData?.category || '产品脑洞');
  const [color, setColor] = useState(initialData?.color || '#4F8CFF');

  // Build tag list from existing ideas + defaults
  const existingTags = Array.from(new Set([...DEFAULT_TAGS, ...data.ideas.map((i) => i.category)]));
  const [allTags, setAllTags] = useState(existingTags);

  const handleAddTag = (tag: string) => {
    if (!allTags.includes(tag)) setAllTags([...allTags, tag]);
  };

  return (
    <div style={{ padding: 20, background: '#fff', border: '3px solid #000', borderRadius: 8, boxShadow: '6px 6px 0 rgba(0,0,0,0.15)', position: 'relative', zIndex: 10 }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, margin: '0 0 12px' }}>
        {initialData ? '编辑想法' : '添加想法'}
      </h4>

      <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>便签颜色</label>
      <ColorPicker value={color} onChange={setColor} />

      <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>标签</label>
      <TagSelector value={category} onChange={setCategory} onAddTag={handleAddTag} allTags={allTags} />

      <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="想法标题..."
        style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-handwriting)', fontSize: 15, marginBottom: 8, boxSizing: 'border-box' }} />
      <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="详细描述（可选）..." rows={3}
        style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', resize: 'vertical' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSave({ content, detail, category, color })} disabled={!content.trim()}
          style={{ flex: 1, padding: '8px 16px', background: 'var(--memphis-primary)', color: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: content.trim() ? 'pointer' : 'not-allowed', opacity: content.trim() ? 1 : 0.5 }}>保存</button>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '8px 16px', background: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>取消</button>
      </div>
    </div>
  );
}

function IdeaDetailModal({ idea, onClose, isAdmin, onEdit, onDelete }: {
  idea: Idea | null; onClose: () => void; isAdmin: boolean;
  onEdit: (idea: Idea) => void; onDelete: (id: string) => void;
}) {
  if (!idea) return null;
  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{
        background: idea.color, border: '3px solid #000', borderRadius: 12, maxWidth: 500, width: '100%',
        padding: '32px 28px', position: 'relative', transform: 'scale(1)', opacity: 1,
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', border: '2px solid #000', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>&times;</button>
        <div className="tape-decoration" style={{ top: -10 }} />
        <span style={{ display: 'inline-block', padding: '3px 12px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{idea.category}</span>
        <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: 22, lineHeight: 1.5, color: '#1A1A1A', margin: '0 0 16px', fontWeight: 700 }}>{idea.content}</p>
        {idea.detail && (
          <div style={{ padding: 16, background: 'rgba(255,255,255,0.5)', border: '1px dashed #000', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>{idea.detail}</p>
          </div>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{idea.date}</span>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px dashed rgba(0,0,0,0.3)' }}>
            <button onClick={() => onEdit(idea)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.7)', border: '2px solid #000', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer' }}>编辑</button>
            <button onClick={() => { if (confirm('确定删除？')) { onDelete(idea.id); onClose(); } }} style={{ padding: '6px 14px', background: 'rgba(255,100,100,0.3)', border: '2px solid #000', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer', color: '#c00' }}>删除</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IdeasSection() {
  const { data, isAdmin, addIdea, updateIdea, deleteIdea } = useEditableData();
  const sectionRef = useRef<HTMLElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [detailIdea, setDetailIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); },
      { threshold: 0.15 }
    );
    // Only observe elements that are not yet visible (fixes newly added ideas)
    const revealEls = sectionRef.current?.querySelectorAll('.scroll-reveal:not(.is-visible)');
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data.ideas]);

  // Golden-angle inspired distribution for organic, non-parallel placement
  const ANGLE_BASES = [-9, 5, -4, 8, -7, 3, -10, 6, -3, 9, -6, 4, -8, 7, -5];
  function getRotation(index: number) {
    const base = ANGLE_BASES[index % ANGLE_BASES.length];
    const jitter = (index * 137.5 % 30 - 15) / 10; // small organic offset
    return Math.round((base + jitter) * 10) / 10;
  }

  const handleSave = (ideaData: { content: string; detail: string; category: string; color: string }) => {
    const date = new Date().toISOString().split('T')[0];
    if (editingId) {
      // Keep existing rotation when editing
      updateIdea(editingId, { ...ideaData });
      setEditingId(null);
      if (detailIdea?.id === editingId) setDetailIdea(null);
    } else {
      const rotation = getRotation(data.ideas.length);
      addIdea({ ...ideaData, rotation, date });
      setShowAddForm(false);
    }
  };

  const editingIdea = editingId ? data.ideas.find((i) => i.id === editingId) : undefined;

  return (
    <>
      <section id="ideas" ref={sectionRef} style={{ position: 'relative', padding: '140px 24px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="scroll-reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, '--start-rotate': '-2deg' } as React.CSSProperties}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--memphis-teal)', transform: 'rotate(-2deg)', marginBottom: 12, textShadow: '3px 3px 0 #000', display: 'inline-block' }}>想法墙</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#666', maxWidth: 480, lineHeight: 1.6, marginBottom: 48 }}>一些随机蹦出来的想法，点击便签查看详情</p>
          </div>
          {isAdmin && !showAddForm && (
            <button onClick={() => setShowAddForm(true)} style={{ padding: '10px 20px', background: 'var(--memphis-primary)', color: '#fff', border: '2px solid #000', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 #000', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> 添加想法
            </button>
          )}
        </div>

        {isAdmin && showAddForm && (
          <div style={{ maxWidth: 400, marginBottom: 32 }}>
            <IdeaForm onSave={handleSave} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {isAdmin && editingId && editingIdea && (
          <div style={{ maxWidth: 400, marginBottom: 32 }}>
            <IdeaForm initialData={editingIdea} onSave={handleSave} onCancel={() => setEditingId(null)} />
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'flex-start' }}>
          {data.ideas.map((idea, i) => {
            if (isAdmin && editingId === idea.id) return null;
            // Deterministic offsets based on index for stable, organic layout
            const rotOffset = ((i * 7) % 5 - 2) * 0.6;
            const rotation = idea.rotation + rotOffset;
            const verticalOffset = ((i * 13) % 5) * 10 - 20;
            const hasDetail = !!idea.detail;

            return (
              <div
                key={idea.id}
                className="scroll-reveal sticky-note"
                onClick={() => setDetailIdea(idea)}
                style={{
                  background: idea.color, border: '2px solid #000', borderRadius: 4,
                  width: 220, height: 190, flex: '0 0 auto',
                  transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
                  '--start-rotate': `${rotation * 1.5}deg`, zIndex: i, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  padding: '16px 14px 10px', boxSizing: 'border-box', position: 'relative',
                } as React.CSSProperties}
              >
                <div className="tape-decoration" />
                {hasDetail && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '1px solid #000', opacity: 0.6 }} />
                )}
                <p style={{
                  fontFamily: 'var(--font-handwriting)', fontSize: 16, lineHeight: 1.45,
                  color: '#1A1A1A', margin: '0 0 auto', fontWeight: 700,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis', wordBreak: 'break-all', flexShrink: 0,
                }}>{idea.content}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 6, marginTop: 8, flexShrink: 0 }}>
                  <span style={{ display: 'inline-block', padding: '3px 8px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{idea.category}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap', flexShrink: 0 }}>{idea.date}</span>
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingTop: 6, borderTop: '1px dashed rgba(0,0,0,0.2)', flexWrap: 'nowrap', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setEditingId(idea.id)} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.7)', border: '1px solid #000', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer' }}>编辑</button>
                    <button onClick={() => { if (confirm('确定删除？')) deleteIdea(idea.id); }} style={{ padding: '3px 10px', background: 'rgba(255,100,100,0.2)', border: '1px solid #000', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer', color: '#c00' }}>删除</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <IdeaDetailModal idea={detailIdea} onClose={() => setDetailIdea(null)} isAdmin={isAdmin} onEdit={(idea) => { setDetailIdea(null); setEditingId(idea.id); }} onDelete={(id) => { setDetailIdea(null); deleteIdea(id); }} />
    </>
  );
}
