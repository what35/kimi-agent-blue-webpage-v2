// 六爻面板：提问、6 次摇铜钱动画、卦图（本卦/变卦/动爻）、纳甲装卦、AI 解读、复制、历史
// 移植自 fortune-site/js/liuyao/view.js
import { useRef, useState } from 'react';
import { castCoins, buildHexagram, type HexagramResult } from './cast';
import { xunKong } from './najia';
import { fourPillars } from '../lib/ganzhi';
import {
  buildLiuyaoPrompt, fallbackLiuyaoReading, describeLiuyao, type LiuyaoDateCtx,
} from '../lib/prompt';
import { runReading } from '../lib/reading';
import { addHistory, listHistory, type HistoryEntry, type LiuyaoHistoryData } from '../lib/settings';
import { CopyBtn, HistoryPanel, xxBtn, xxInput, xxLabel } from '../ui';

const VALUE_NAMES: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' };
const YAO_NAMES = ['初', '二', '三', '四', '五', '上'];
const ROUND_NAMES = ['一', '二', '三', '四', '五', '六'];

// 由 6-9 值推出三枚铜钱正背：字=3 背=2，字数 = 值 - 6
function coinsOf(value: number): string[] {
  const heads = value - 6;
  return [0, 1, 2].map((i) => (i < heads ? '字' : '背'));
}

interface CastLine {
  value: number;
  revealed: boolean;
}

type Phase = 'idle' | 'casting' | 'done';

export default function LiuyaoPanel() {
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [casts, setCasts] = useState<CastLine[]>([]);
  const [previewLines, setPreviewLines] = useState<number[]>([]);
  const [result, setResult] = useState<HexagramResult | null>(null);
  const [dateCtx, setDateCtx] = useState<LiuyaoDateCtx | undefined>(undefined);
  const [reading, setReading] = useState('');
  const [readingBusy, setReadingBusy] = useState(false);
  const [histVer, setHistVer] = useState(0);

  const skipRef = useRef(false);
  const genRef = useRef(0);
  const waitsRef = useRef(new Set<{ id: number; res: () => void }>());

  const wait = (ms: number) => new Promise<void>((res) => {
    if (skipRef.current) { res(); return; }
    const w = { id: window.setTimeout(() => { waitsRef.current.delete(w); res(); }, ms), res };
    waitsRef.current.add(w);
  });

  const skipAll = () => {
    skipRef.current = true;
    waitsRef.current.forEach((w) => { clearTimeout(w.id); w.res(); });
    waitsRef.current.clear();
  };

  const handleCast = async () => {
    const gen = ++genRef.current;
    skipRef.current = false;
    setCasts([]);
    setPreviewLines([]);
    setResult(null);
    setReading('');
    setPhase('casting');

    const values: number[] = [];
    for (let round = 0; round < 6; round++) {
      const value = castCoins();
      values.push(value);
      // 铜钱先以未知面翻转，落定后显示真实结果
      setCasts((prev) => [...prev, { value, revealed: false }]);
      await wait(550);
      if (gen !== genRef.current) return;
      setCasts((prev) => prev.map((c, i) => (i === round ? { ...c, revealed: true } : c)));
      // 爻线堆入迷你卦画（初爻在下）
      setPreviewLines((prev) => [...prev, value === 7 || value === 9 ? 1 : 0]);
      await wait(150);
      if (gen !== genRef.current) return;
    }

    const r = buildHexagram(values);
    // 起卦时刻的月建日辰（六爻断卦以日月为纲）
    const today = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${today.getFullYear()}-${p(today.getMonth() + 1)}-${p(today.getDate())}`;
    const pillars = fourPillars(dateStr, today.getHours());
    const ctx: LiuyaoDateCtx = { monthBranch: pillars.month[1], dayGZ: pillars.day, kong: xunKong(pillars.day) };
    setResult(r);
    setDateCtx(ctx);
    setPhase('done');
  };

  const handleRead = async () => {
    if (!result) return;
    setReadingBusy(true);
    setReading('解读中…');
    const recent = listHistory('liuyao').slice(0, 2).map((e) => e.result);
    const fallback = fallbackLiuyaoReading({ result, dateCtx });
    const text = await runReading({
      prompt: buildLiuyaoPrompt({ question, result, dateCtx, recent }),
      fallback,
      setText: setReading,
    });
    addHistory({
      type: 'liuyao',
      question: question.trim(),
      result: result.bian ? `${result.ben.name} 之 ${result.bian.name}` : `${result.ben.name}（无动爻）`,
      reading: text,
      ts: Date.now(),
      data: { result, dateCtx },
    });
    setHistVer((v) => v + 1);
    setReadingBusy(false);
  };

  const reprompt = (entry: HistoryEntry, q: string) => {
    const d = entry.data as LiuyaoHistoryData;
    return {
      prompt: buildLiuyaoPrompt({ question: q, result: d.result, dateCtx: d.dateCtx }),
      fallback: fallbackLiuyaoReading({ result: d.result, dateCtx: d.dateCtx }),
    };
  };

  const casting = phase === 'casting';
  const benSymbol = result ? String.fromCodePoint(0x4DC0 + result.ben.n - 1) : '';

  return (
    <div>
      <div className="xx-panel">
        {xxLabel('你想问什么？（可留空）')}
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：这笔投资能成吗？"
          style={{ ...xxInput, resize: 'vertical', marginBottom: 10 }}
        />
        <p className="xx-muted" style={{ margin: '0 0 14px' }}>取当前时辰起卦。</p>
        <button
          onClick={handleCast}
          disabled={casting}
          style={{ ...xxBtn(), opacity: casting ? 0.6 : 1 }}
        >
          开始摇卦
        </button>
      </div>

      {/* 动画区：左侧摇卦记录，右侧迷你卦画逐爻堆叠；点击可跳过 */}
      {casting && (
        <div className="xx-cast-wrap" style={{ marginTop: 20, cursor: 'pointer' }} onClick={skipAll}>
          <div className="xx-panel xx-casts-panel">
            {casts.map((c, i) => (
              <div key={i} className="xx-cast-line">
                <span className="xx-cast-round">第{ROUND_NAMES[i]}摇</span>
                <span>
                  {(c.revealed ? coinsOf(c.value) : ['？', '？', '？']).map((face, j) => (
                    <span key={j} className={`xx-coin${c.revealed ? '' : ' xx-flipping'}`}>{face}</span>
                  ))}
                </span>
                <span className="xx-cast-value">{c.revealed ? VALUE_NAMES[c.value] : ''}</span>
              </div>
            ))}
            <p className="xx-skip-hint" style={{ textAlign: 'left', marginTop: 12 }}>摇卦中…（点击可跳过动画）</p>
          </div>
          <div className="xx-panel xx-gua-preview">
            <p className="xx-muted xx-gua-preview-title">卦起</p>
            <div className="xx-gua-preview-lines">
              {previewLines.map((l, i) => (
                <span key={i} className={`xx-mini-yao ${l ? 'xx-yang' : 'xx-yin'} xx-slide-in`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 卦画（六爻自下而上，显示时上爻在顶） */}
      {phase === 'done' && result && (
        <div className="xx-panel" style={{ marginTop: 20 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            margin: '0 0 14px', color: 'var(--color-text)', letterSpacing: '0.1em',
          }}>
            本卦：{result.ben.name}（上{result.ben.upper}下{result.ben.lower}） {benSymbol}
          </h3>
          <div className="xx-gua-lines">
            {[5, 4, 3, 2, 1, 0].map((i) => (
              <div key={i} className="xx-yao-row">
                <span className="xx-yao-label">
                  {YAO_NAMES[i]}爻{result.moving[i] ? (result.values[i] === 9 ? ' ○动' : ' ×动') : ''}
                </span>
                <span className={`xx-yao ${result.lines[i] ? 'xx-yang' : 'xx-yin'}`} />
              </div>
            ))}
          </div>
          <div className="xx-reading">{describeLiuyao(result, dateCtx)}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleRead}
              disabled={readingBusy}
              style={{ ...xxBtn(), opacity: readingBusy ? 0.6 : 1 }}
            >
              AI 解读
            </button>
            <CopyBtn getText={() => `${describeLiuyao(result, dateCtx)}\n\n解读：\n${reading}`} />
          </div>
          {reading && <div className="xx-reading">{reading}</div>}
        </div>
      )}

      <HistoryPanel key={histVer} type="liuyao" reprompt={reprompt} />
    </div>
  );
}
