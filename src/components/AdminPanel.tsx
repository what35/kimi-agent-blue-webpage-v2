import { useState, useEffect } from 'react';
import { useEditableData } from '../context/EditableDataContext';
import type { Tool, TimelineItem } from '../data/siteData';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', border: '2px solid #000', borderRadius: 4,
  fontSize: 12, marginBottom: 6, boxSizing: 'border-box', fontFamily: 'var(--font-body)',
};
const btnStyle = (bg: string, color = '#000'): React.CSSProperties => ({
  padding: '4px 10px', background: bg, color, border: '2px solid #000', borderRadius: 4,
  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, cursor: 'pointer',
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '6px 10px', background: open ? 'var(--memphis-primary)' : '#f0f0f0',
        color: open ? '#fff' : '#333', border: '2px solid #000', borderRadius: 6,
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {title}<span style={{ fontSize: 16 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding: '10px 4px 0' }}>{children}</div>}
    </div>
  );
}

const TIMELINE_COLORS = ['#4F8CFF', '#86CCCA', '#FFCE5C', '#5B6FA8'];
const SHAPES = ['triangle', 'circle', 'zigzag', 'wave', 'dot'];

/* ===== Tagline Editor (local state + save/cancel) ===== */
function TaglineEditor({ profile, updateBrand, updateBio }: any) {
  const [tagline, setTagline] = useState(profile.brand.tagline);
  const [signature, setSignature] = useState(profile.brand.signature);
  const [bio, setBio] = useState(profile.bio);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setTagline(profile.brand.tagline); setSignature(profile.brand.signature); setBio(profile.bio); setDirty(false); }, [profile.brand.tagline, profile.brand.signature, profile.bio]);

  const handleSave = () => { updateBrand({ tagline, signature }); updateBio(bio); setDirty(false); };
  const handleCancel = () => { setTagline(profile.brand.tagline); setSignature(profile.brand.signature); setBio(profile.bio); setDirty(false); };

  return (
    <>
      <label style={{ fontSize: 11, fontWeight: 600 }}>标语</label>
      <input value={tagline} onChange={(e) => { setTagline(e.target.value); setDirty(true); }} style={inputStyle} />
      <label style={{ fontSize: 11, fontWeight: 600 }}>签名</label>
      <input value={signature} onChange={(e) => { setSignature(e.target.value); setDirty(true); }} style={inputStyle} />
      <label style={{ fontSize: 11, fontWeight: 600 }}>简介</label>
      <textarea value={bio} onChange={(e) => { setBio(e.target.value); setDirty(true); }} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}
    </>
  );
}

/* ===== Skills Editor (local state + save/cancel) ===== */
function SkillsEditor({ skills, updateSkills }: any) {
  const [items, setItems] = useState(() => JSON.parse(JSON.stringify(skills)));
  const [dirty, setDirty] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDetail, setNewDetail] = useState('');

  useEffect(() => { setItems(JSON.parse(JSON.stringify(skills))); setDirty(false); }, [skills]);

  const updateItem = (i: number, field: string, val: string) => {
    const next = [...items]; next[i] = { ...next[i], [field]: val }; setItems(next); setDirty(true);
  };
  const removeItem = (i: number) => { const next = items.filter((_: any, j: number) => j !== i); setItems(next); setDirty(true); };
  const handleSave = () => { updateSkills(items); setDirty(false); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(skills))); setDirty(false); };
  const handleAdd = () => {
    if (!newName.trim()) return;
    setItems([...items, { name: newName, level: 80, shape: SHAPES[items.length % SHAPES.length], color: TIMELINE_COLORS[items.length % 4], detail: newDetail }]);
    setNewName(''); setNewDetail(''); setDirty(true);
  };

  return (
    <>
      {items.map((s: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input value={s.name} onChange={(e) => updateItem(i, 'name', e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
          <input value={s.detail || ''} onChange={(e) => updateItem(i, 'detail', e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} placeholder="详情" />
          <button onClick={() => removeItem(i)} style={{ ...btnStyle('#ffcccc', '#c00'), padding: '2px 6px', fontSize: 14 }}>&times;</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="新技能名" />
        <input value={newDetail} onChange={(e) => setNewDetail(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} placeholder="详情" />
        <button onClick={handleAdd} style={btnStyle('var(--memphis-teal)', '#fff')}>+</button>
      </div>
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}
    </>
  );
}

/* ===== Hobbies Editor (local state + save/cancel) ===== */
function HobbiesEditor({ hobbies, updateHobbies }: any) {
  const [items, setItems] = useState(() => JSON.parse(JSON.stringify(hobbies)));
  const [dirty, setDirty] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDetail, setNewDetail] = useState('');

  useEffect(() => { setItems(JSON.parse(JSON.stringify(hobbies))); setDirty(false); }, [hobbies]);

  const updateItem = (i: number, field: string, val: string) => {
    const next = [...items]; next[i] = { ...next[i], [field]: val }; setItems(next); setDirty(true);
  };
  const removeItem = (i: number) => { const next = items.filter((_: any, j: number) => j !== i); setItems(next); setDirty(true); };
  const handleSave = () => { updateHobbies(items); setDirty(false); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(hobbies))); setDirty(false); };
  const handleAdd = () => {
    if (!newName.trim()) return;
    setItems([...items, { name: newName, detail: newDetail }]);
    setNewName(''); setNewDetail(''); setDirty(true);
  };

  return (
    <>
      {items.map((h: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input value={h.name} onChange={(e) => updateItem(i, 'name', e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
          <input value={h.detail || ''} onChange={(e) => updateItem(i, 'detail', e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} placeholder="详情" />
          <button onClick={() => removeItem(i)} style={{ ...btnStyle('#ffcccc', '#c00'), padding: '2px 6px', fontSize: 14 }}>&times;</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="新爱好" />
        <input value={newDetail} onChange={(e) => setNewDetail(e.target.value)} style={{ ...inputStyle, flex: 2, marginBottom: 0 }} placeholder="详情" />
        <button onClick={handleAdd} style={btnStyle('var(--memphis-teal)', '#fff')}>+</button>
      </div>
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}
    </>
  );
}

/* ===== Timeline Editor (local state + save/cancel + year validation + auto-sort) ===== */
function TimelineEditor({ timeline, updateTimeline }: any) {
  const [items, setItems] = useState<TimelineItem[]>(() => JSON.parse(JSON.stringify(timeline)));
  const [dirty, setDirty] = useState(false);
  const [newYear, setNewYear] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [yearError, setYearError] = useState('');

  // Auto-sort items by year ascending
  const sortedItems = [...items].sort((a, b) => parseInt(a.year) - parseInt(b.year));

  useEffect(() => { setItems(JSON.parse(JSON.stringify(timeline))); setDirty(false); setYearError(''); }, [timeline]);

  const validateYear = (year: string) => {
    const num = parseInt(year);
    if (isNaN(num) || year.length !== 4) return '请输入4位年份（如2025）';
    if (num < 1990 || num > 2100) return '年份范围 1990-2100';
    return '';
  };

  const updateItem = (i: number, field: string, val: string) => {
    if (field === 'year') { const err = validateYear(val); setYearError(err); }
    const next = [...items]; next[i] = { ...next[i], [field]: val }; setItems(next); setDirty(true);
  };
  const removeItem = (i: number) => { const next = items.filter((_: any, j: number) => j !== i); setItems(next); setDirty(true); };
  const handleSave = () => {
    // Validate all years before saving
    for (const item of items) {
      const err = validateYear(item.year);
      if (err) { setYearError(`${item.year}: ${err}`); return; }
    }
    // Auto-sort before saving: oldest (smallest year) first
    const sorted = [...items].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    updateTimeline(sorted);
    setDirty(false); setYearError('');
  };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(timeline))); setDirty(false); setYearError(''); };
  const handleAdd = () => {
    const err = validateYear(newYear);
    if (err) { setYearError(err); return; }
    if (!newTitle.trim()) return;
    const color = TIMELINE_COLORS[items.length % TIMELINE_COLORS.length];
    const newItem: TimelineItem = { year: newYear, title: newTitle, desc: newDesc, memphis: { shape: 'circle', color, rotate: (items.length % 3 - 1) * 3 } };
    setItems([...items, newItem]);
    setNewYear(''); setNewTitle(''); setNewDesc(''); setYearError(''); setDirty(true);
  };

  return (
    <>
      {yearError && <p style={{ color: '#ff4444', fontSize: 11, margin: '0 0 6px' }}>{yearError}</p>}
      {sortedItems.map((t: TimelineItem, i: number) => (
        <div key={`${t.year}-${t.title}-${i}`} style={{ marginBottom: 6, padding: 6, border: '1px dashed #ccc', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <input value={t.year} onChange={(e) => updateItem(items.indexOf(t), 'year', e.target.value)} style={{ ...inputStyle, width: 60, marginBottom: 4 }} />
            <input value={t.title} onChange={(e) => updateItem(items.indexOf(t), 'title', e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 4 }} />
            <button onClick={() => removeItem(items.indexOf(t))} style={{ ...btnStyle('#ffcccc', '#c00'), padding: '2px 6px', fontSize: 14 }}>&times;</button>
          </div>
          <textarea value={t.desc} onChange={(e) => updateItem(items.indexOf(t), 'desc', e.target.value)} rows={2} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
      ))}
      <div style={{ marginTop: 6, padding: 6, border: '2px dashed var(--memphis-primary)', borderRadius: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>+ 新经历</p>
        <div style={{ display: 'flex', gap: 4 }}>
          <input value={newYear} onChange={(e) => { setNewYear(e.target.value); setYearError(''); }} style={{ ...inputStyle, width: 60, marginBottom: 4 }} placeholder="年份" />
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 4 }} placeholder="标题" />
        </div>
        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} style={{ ...inputStyle, marginBottom: 4 }} placeholder="描述" />
        <button onClick={handleAdd} style={{ ...btnStyle('var(--memphis-teal)', '#fff'), width: '100%' }}>添加经历</button>
      </div>
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}
    </>
  );
}

/* ===== Honors Editor (local state + save/cancel) ===== */
function HonorsEditor({ honors, updateHonors }: any) {
  const [items, setItems] = useState(() => JSON.parse(JSON.stringify(honors)));
  const [dirty, setDirty] = useState(false);
  const [newHonor, setNewHonor] = useState('');

  useEffect(() => { setItems(JSON.parse(JSON.stringify(honors))); setDirty(false); }, [honors]);

  const updateItem = (i: number, val: string) => { const next = [...items]; next[i] = val; setItems(next); setDirty(true); };
  const removeItem = (i: number) => { const next = items.filter((_: any, j: number) => j !== i); setItems(next); setDirty(true); };
  const handleSave = () => { updateHonors(items); setDirty(false); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(honors))); setDirty(false); };
  const handleAdd = () => { if (!newHonor.trim()) return; setItems([...items, newHonor]); setNewHonor(''); setDirty(true); };

  return (
    <>
      {items.map((h: string, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input value={h} onChange={(e) => updateItem(i, e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
          <button onClick={() => removeItem(i)} style={{ ...btnStyle('#ffcccc', '#c00'), padding: '2px 6px', fontSize: 14 }}>&times;</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        <input value={newHonor} onChange={(e) => setNewHonor(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="新荣誉" />
        <button onClick={handleAdd} style={btnStyle('var(--memphis-teal)', '#fff')}>+</button>
      </div>
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}
    </>
  );
}

/* ===== Tools Editor (local state + save/cancel + detailed edit modal) ===== */
function ToolsEditor({ tools, updateTools }: any) {
  const [items, setItems] = useState<Tool[]>(() => JSON.parse(JSON.stringify(tools)));
  const [dirty, setDirty] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');

  useEffect(() => { setItems(JSON.parse(JSON.stringify(tools))); setDirty(false); }, [tools]);

  const removeItem = (i: number) => { const next = items.filter((_: any, j: number) => j !== i); setItems(next); setDirty(true); };
  const handleSave = () => { updateTools(items); setDirty(false); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(tools))); setDirty(false); };
  const handleAdd = () => {
    if (!newName.trim()) return;
    const c = TIMELINE_COLORS;
    const newTool: Tool = {
      id: `tool-${Date.now()}`, name: newName, tagline: newTagline,
      category: '工具', memphis: { shape: 'circle', primary: c[items.length % 4], accent: c[(items.length + 1) % 4] },
      media: { cover: '/tool-clipboard.jpg' }, docs: '## 功能介绍\n\n待补充...',
      download: { file: '#', size: 'Web', version: '1.0', platforms: ['web'] },
      links: { demo: '#', source: '#' }, updated: new Date().toISOString().slice(0, 7),
    };
    setItems([...items, newTool]);
    setNewName(''); setNewTagline(''); setDirty(true);
  };
  const handleUpdateTool = (updated: Tool) => {
    const next = items.map((t) => t.id === updated.id ? updated : t);
    setItems(next);
    setEditingTool(null);
    setDirty(true);
  };

  return (
    <>
      {items.map((t: Tool, i: number) => (
        <div key={t.id} style={{ marginBottom: 6, padding: 6, border: '1px dashed #ccc', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ ...inputStyle, flex: 1, marginBottom: 0, background: '#f9f9f9', display: 'flex', alignItems: 'center' }}>{t.name}</span>
            <button onClick={() => setEditingTool(t)} style={{ ...btnStyle('#e0e0ff'), padding: '4px 10px', fontSize: 11 }}>详细编辑</button>
            <button onClick={() => removeItem(i)} style={{ ...btnStyle('#ffcccc', '#c00'), padding: '2px 6px', fontSize: 14 }}>&times;</button>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="工具名称" />
        <input value={newTagline} onChange={(e) => setNewTagline(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="介绍" />
        <button onClick={handleAdd} style={btnStyle('var(--memphis-teal)', '#fff')}>+</button>
      </div>
      {dirty && <DirtyBar onSave={handleSave} onCancel={handleCancel} />}

      {/* Detailed Tool Edit Modal */}
      {editingTool && (
        <ToolEditModal tool={editingTool} onSave={handleUpdateTool} onClose={() => setEditingTool(null)} />
      )}
    </>
  );
}

/* ===== Detailed Tool Edit Modal ===== */
function ToolEditModal({ tool, onSave, onClose }: { tool: Tool; onSave: (t: Tool) => void; onClose: () => void }) {
  const [name, setName] = useState(tool.name);
  const [tagline, setTagline] = useState(tool.tagline);
  const [category, setCategory] = useState(tool.category);
  const [docs, setDocs] = useState(tool.docs);
  const [video, setVideo] = useState(tool.media.video || '');
  const [cover, setCover] = useState(tool.media.cover);
  const [version, setVersion] = useState(tool.download.version);
  const [size, setSize] = useState(tool.download.size);
  const [platforms, setPlatforms] = useState(tool.download.platforms.join(', '));
  const [updated, setUpdated] = useState(tool.updated);
  const [demoLink, setDemoLink] = useState(tool.links.demo);

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: '#fff', border: '3px solid #000', borderRadius: 12, maxWidth: 600, width: '90%',
        maxHeight: '85vh', overflowY: 'auto', padding: '24px 20px', position: 'relative',
        boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%',
          border: '2px solid #000', background: '#fff', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700,
        }}>&times;</button>

        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: '0 0 16px' }}>
          编辑工具：{tool.name}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>分类</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={{ fontSize: 11, fontWeight: 600 }}>一句话介绍</label>
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} style={inputStyle} />

        <label style={{ fontSize: 11, fontWeight: 600 }}>封面图路径</label>
        <input value={cover} onChange={(e) => setCover(e.target.value)} style={inputStyle} placeholder="如 /tool-cover.jpg" />

        <label style={{ fontSize: 11, fontWeight: 600 }}>演示视频链接</label>
        <input value={video} onChange={(e) => setVideo(e.target.value)} style={inputStyle} placeholder="如 https://www.bilibili.com/video/BV1xx..." />
        <p style={{ fontSize: 10, color: '#888', margin: '-4px 0 8px' }}>
          支持 Bilibili、YouTube 链接自动嵌入。无法本地上传（浏览器限制约5MB）。
        </p>

        <label style={{ fontSize: 11, fontWeight: 600 }}>说明文档 (Markdown)</label>
        <textarea value={docs} onChange={(e) => setDocs(e.target.value)} rows={8} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>版本</label>
            <input value={version} onChange={(e) => setVersion(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>大小</label>
            <input value={size} onChange={(e) => setSize(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>更新时间</label>
            <input value={updated} onChange={(e) => setUpdated(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={{ fontSize: 11, fontWeight: 600 }}>平台（逗号分隔）</label>
        <input value={platforms} onChange={(e) => setPlatforms(e.target.value)} style={inputStyle} placeholder="web, win, mac" />

        <label style={{ fontSize: 11, fontWeight: 600 }}>演示链接</label>
        <input value={demoLink} onChange={(e) => setDemoLink(e.target.value)} style={inputStyle} />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => {
            onSave({ ...tool, name, tagline, category, docs, media: { cover, video: video || undefined }, download: { ...tool.download, version, size, platforms: platforms.split(',').map((p: string) => p.trim()).filter(Boolean) }, links: { ...tool.links, demo: demoLink }, updated });
          }} style={{ flex: 1, ...btnStyle('var(--memphis-primary)', '#fff'), padding: '8px 16px', fontSize: 13 }}>保存</button>
          <button onClick={onClose} style={{ flex: 1, ...btnStyle('#fff'), padding: '8px 16px', fontSize: 13 }}>取消</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Dirty Bar: Save/Cancel indicator ===== */
function DirtyBar({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginTop: 10, padding: '8px 10px', background: 'rgba(79,140,255,0.1)',
      border: '2px dashed var(--memphis-primary)', borderRadius: 6, alignItems: 'center',
    }}>
      <span style={{ fontSize: 12, color: '#4F8CFF', fontWeight: 600, flex: 1 }}>有未保存的更改</span>
      <button onClick={onSave} style={{ ...btnStyle('var(--memphis-primary)', '#fff'), padding: '5px 14px' }}>保存</button>
      <button onClick={onCancel} style={{ ...btnStyle('#fff'), padding: '5px 14px' }}>取消</button>
    </div>
  );
}

/* ===== Main Panel ===== */
export default function AdminPanel() {
  const ctx = useEditableData();
  const { data, isAdmin, showAdminPanel, toggleAdminPanel, login, logout, changePassword,
    updateBrand, updateBio, updateSkills, updateHobbies, updateTimeline, updateHonors, updateTools } = ctx;

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const profile = data.profile;
  const tools = data.tools;

  if (!isAdmin) {
    return (
      <div style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 95 }}>
        <button onClick={toggleAdminPanel} title="管理后台" style={{
          width: 40, height: 40, borderRadius: '50%', border: '2px solid #000',
          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '2px 2px 0 #000', fontSize: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </button>
        {showAdminPanel && (
          <div style={{ position: 'absolute', bottom: 50, right: 0, padding: 16, background: '#fff',
            border: '2px solid #000', borderRadius: 8, boxShadow: '4px 4px 0 #000', width: 220 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>管理员登录</p>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="输入密码"
              style={{ ...inputStyle, border: `2px solid ${error ? '#ff4444' : '#000'}` }} />
            {error && <p style={{ color: '#ff4444', fontSize: 11, margin: '0 0 8px' }}>密码错误</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleLogin} style={btnStyle('var(--memphis-primary)', '#fff')}>登录</button>
              <button onClick={toggleAdminPanel} style={btnStyle('#fff')}>取消</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function handleLogin() {
    if (login(password)) { setPassword(''); setError(false); }
    else setError(true);
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, maxWidth: 320, width: 'calc(100vw - 48px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: 'var(--memphis-primary)', border: '2px solid #000', borderRadius: 8,
        color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
        编辑模式
        <button onClick={logout} style={{ marginLeft: 'auto', padding: '2px 8px',
          background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: 4, color: '#fff', fontSize: 11, cursor: 'pointer' }}>退出</button>
      </div>

      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: 8, background: '#fff',
        border: '2px solid #000', borderRadius: 8, boxShadow: '6px 6px 0 rgba(0,0,0,0.15)' }}>

        <Section title="标语 &amp; 简介">
          <TaglineEditor profile={profile} updateBrand={updateBrand} updateBio={updateBio} />
        </Section>

        <Section title="技能标签">
          <SkillsEditor skills={profile.skills} updateSkills={updateSkills} />
        </Section>

        <Section title="个人爱好">
          <HobbiesEditor hobbies={profile.hobbies} updateHobbies={updateHobbies} />
        </Section>

        <Section title="经历地图">
          <TimelineEditor timeline={profile.timeline} updateTimeline={updateTimeline} />
        </Section>

        <Section title="荣誉墙">
          <HonorsEditor honors={profile.honors} updateHonors={updateHonors} />
        </Section>

        <Section title="工具箱">
          <ToolsEditor tools={tools} updateTools={updateTools} />
        </Section>

        <Section title="修改密码">
          <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} style={inputStyle} placeholder="旧密码" />
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle} placeholder="新密码（至少4位）" />
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePw()} style={inputStyle} placeholder="确认新密码" />
          {pwMsg && <p style={{ color: pwMsg.includes('成功') ? '#22c55e' : '#ff4444', fontSize: 11, margin: '0 0 6px' }}>{pwMsg}</p>}
          <button onClick={handlePw} style={{ ...btnStyle('var(--memphis-primary)', '#fff'), width: '100%' }}>确认修改</button>
        </Section>
      </div>
    </div>
  );

  function handlePw() {
    setPwMsg('');
    if (newPw !== confirmPw) { setPwMsg('两次新密码不一致'); return; }
    if (newPw.length < 4) { setPwMsg('密码至少4位'); return; }
    if (changePassword(oldPw, newPw)) { setPwMsg('修改成功'); setOldPw(''); setNewPw(''); setConfirmPw(''); }
    else setPwMsg('旧密码错误');
  }
}
