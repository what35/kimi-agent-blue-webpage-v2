// 玄学整页：标题 + 塔罗/六爻/设置 Tab 切换
import { useState } from 'react';
import { usePage } from '../context/PageContext';
import TarotPanel from './tarot/TarotPanel';
import LiuyaoPanel from './liuyao/LiuyaoPanel';
import { createLlmClient } from './lib/llm';
import {
  PROVIDERS, getProvider, loadSettings, saveSettings, type XuanxueSettings,
} from './lib/settings';
import { xxBtn, xxInput, xxLabel } from './ui';
import './xuanxue.css';

type Tab = 'tarot' | 'liuyao' | 'settings';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'tarot', label: '🃏 塔罗牌' },
  { id: 'liuyao', label: '☯️ 六爻' },
  { id: 'settings', label: '⚙️ 设置' },
];

function SettingsPanel() {
  const [form, setForm] = useState<XuanxueSettings>(() => loadSettings());
  const [status, setStatus] = useState('');
  const [testing, setTesting] = useState(false);

  const update = (patch: Partial<XuanxueSettings>, extraStatus?: string) => {
    const next = { ...form, ...patch };
    setForm(next);
    saveSettings(next);
    setStatus(extraStatus ?? '已自动保存。');
  };

  const handleProvider = (id: string) => {
    const p = getProvider(id);
    update(
      { provider: id, baseUrl: p.baseUrl, model: p.model },
      id === 'custom' ? '自定义模式：请手动填写 Base URL 与模型。' : `已切换为 ${p.name}，填入 API Key 即可。`,
    );
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus('测试中…');
    try {
      const llm = createLlmClient(form);
      const out = await llm.chat({ system: 'ping', user: '回复「连接成功」即可' });
      setStatus(`连接成功（${form.model}），模型返回：${out.slice(0, 50)}`);
    } catch (e) {
      setStatus(`连接失败：${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setTesting(false);
    }
  };

  const field = (label: string, key: keyof XuanxueSettings, type: string) => (
    <div style={{ marginBottom: 14 }}>
      {xxLabel(label)}
      <input
        type={type}
        value={form[key]}
        onChange={(e) => update({ [key]: e.target.value.trim() } as Partial<XuanxueSettings>)}
        style={xxInput}
      />
    </div>
  );

  return (
    <div className="xx-panel" style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 14 }}>
        {xxLabel('服务商')}
        <select
          value={form.provider}
          onChange={(e) => handleProvider(e.target.value)}
          style={{ ...xxInput, cursor: 'pointer' }}
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      {field('Base URL（OpenAI 兼容）', 'baseUrl', 'text')}
      {field('API Key（仅存于本机浏览器）', 'apiKey', 'password')}
      {field('模型', 'model', 'text')}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleTest} disabled={testing} style={{ ...xxBtn(), opacity: testing ? 0.6 : 1 }}>
          测试连接
        </button>
      </div>
      {status && <p className="xx-muted" style={{ marginTop: 12 }}>{status}</p>}
      <p className="xx-muted" style={{ marginTop: 12 }}>
        不填 API Key 也能用：解读会自动切换为本地兜底文案。
      </p>
    </div>
  );
}

export default function XuanxuePage() {
  const { setPage } = usePage();
  const [tab, setTab] = useState<Tab>('tarot');

  return (
    <section style={{ position: 'relative', padding: '100px 24px 60px', maxWidth: 1100, margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => setPage('home')}
          style={{ padding: '6px 14px', background: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#000' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
          返回首页
        </button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--memphis-primary)', transform: 'rotate(-1deg)', textShadow: '3px 3px 0 #000', display: 'inline-block', marginBottom: 8 }}>
          玄学
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#888', lineHeight: 1.6 }}>
          塔罗与六爻，诚心一问。解读由 AI 生成或本地兜底，仅供参考，人事为本。
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t, i) => {
          const active = tab === t.id;
          const rotations = [-1, 0.5, -0.5];
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...xxBtn({ secondary: !active }),
                padding: '10px 24px',
                transform: `rotate(${rotations[i]}deg)${active ? ' translateY(-2px)' : ''}`,
                boxShadow: active ? '3px 3px 0 #000' : 'none',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'tarot' && <TarotPanel />}
      {tab === 'liuyao' && <LiuyaoPanel />}
      {tab === 'settings' && <SettingsPanel />}
    </section>
  );
}
