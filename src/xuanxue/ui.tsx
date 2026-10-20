// 玄学模块共享 UI：Memphis 风格按钮、复制按钮、历史记录面板
import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  listHistory, removeHistory, clearHistory,
  type HistoryEntry, type HistoryType,
} from './lib/settings';
import { runReading } from './lib/reading';
import type { Prompt } from './lib/prompt';

export function xxBtn(opts?: { secondary?: boolean; small?: boolean; danger?: boolean }): CSSProperties {
  const { secondary, small, danger } = opts ?? {};
  return {
    padding: small ? '4px 12px' : '10px 22px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: small ? 12 : 14,
    border: `2px solid ${danger ? '#c00' : '#000'}`,
    borderRadius: 8,
    background: secondary ? '#fff' : 'var(--memphis-primary)',
    color: danger ? '#c00' : secondary ? 'var(--color-text)' : '#fff',
    cursor: 'pointer',
    boxShadow: secondary ? 'none' : '3px 3px 0 #000',
    transition: 'all 0.2s',
  };
}

export const xxInput: CSSProperties = {
  width: '100%',
  padding: 10,
  border: '2px solid #000',
  borderRadius: 6,
  fontSize: 14,
  boxSizing: 'border-box',
  background: '#fff',
  color: '#1A1A1A',
  fontFamily: 'var(--font-body)',
};

export function xxLabel(text: string) {
  return (
    <label style={{
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
      display: 'block', marginBottom: 6, color: 'var(--color-text)',
    }}>
      {text}
    </label>
  );
}

// 「复制结果」按钮：一键复制全文，带成功反馈与降级提示
export function CopyBtn({ getText }: { getText: () => string }) {
  const [label, setLabel] = useState('复制结果');
  const handleClick = async () => {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setLabel('已复制 ✓');
    } catch {
      setLabel('复制失败，请手动选择文本');
    }
    setTimeout(() => setLabel('复制结果'), 1600);
  };
  return (
    <button onClick={handleClick} style={xxBtn({ secondary: true })}>
      {label}
    </button>
  );
}

const TYPE_NAMES: Record<HistoryType, string> = { tarot: '塔罗牌', liuyao: '六爻' };

// 历史记录面板：查看解读 / 基于原卦再次解读 / 删除 / 清空
export function HistoryPanel({ type, reprompt }: {
  type: HistoryType;
  reprompt: (entry: HistoryEntry, question: string) => { prompt: Prompt; fallback: string };
}) {
  const [items, setItems] = useState<HistoryEntry[]>(() => listHistory(type));
  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [reQuestion, setReQuestion] = useState('');
  const [reOut, setReOut] = useState('');
  const [reBusy, setReBusy] = useState(false);

  const refresh = () => setItems(listHistory(type));

  if (!items.length) {
    return <p className="xx-muted" style={{ marginTop: 24 }}>还没有记录。</p>;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, margin: 0, color: 'var(--color-text)' }}>
          历史记录（{items.length}）
        </h3>
        <button
          onClick={() => { if (confirm(`确定清空全部 ${TYPE_NAMES[type]}记录？`)) { clearHistory(type); refresh(); } }}
          style={xxBtn({ secondary: true, small: true, danger: true })}
        >
          清空历史
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item) => (
          <div key={item.id} className="xx-panel" style={{ padding: '14px 18px' }}>
            <p className="xx-muted" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {new Date(item.ts).toLocaleString('zh-CN')}
              <button
                onClick={() => { setOpenFormId(openFormId === item.id ? null : item.id); setReOut(''); setReQuestion(''); }}
                style={xxBtn({ secondary: true, small: true })}
              >
                再次解读
              </button>
              <button
                onClick={() => { if (confirm('删除这条记录？')) { removeHistory(type, item.id); refresh(); } }}
                style={xxBtn({ secondary: true, small: true, danger: true })}
              >
                删除
              </button>
            </p>
            {item.question && <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--color-text)' }}>问：{item.question}</p>}
            <p className="xx-result-line">{item.result}</p>
            <details className="xx-history-item">
              <summary>查看解读</summary>
              <div className="xx-reading" style={{ fontSize: 14 }}>{item.reading}</div>
            </details>
            {openFormId === item.id && (
              <div style={{ marginTop: 10 }}>
                <textarea
                  rows={2}
                  value={reQuestion}
                  onChange={(e) => setReQuestion(e.target.value)}
                  placeholder="基于原卦，换个问题再问…"
                  style={{ ...xxInput, resize: 'vertical' }}
                />
                <button
                  disabled={reBusy}
                  onClick={async () => {
                    setReBusy(true);
                    setReOut('解读中…');
                    const { prompt, fallback } = reprompt(item, reQuestion);
                    await runReading({ prompt, fallback, setText: setReOut });
                    setReBusy(false);
                  }}
                  style={{ ...xxBtn(), marginTop: 8, opacity: reBusy ? 0.6 : 1 }}
                >
                  解读
                </button>
                {reOut && <div className="xx-reading" style={{ fontSize: 14 }}>{reOut}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
