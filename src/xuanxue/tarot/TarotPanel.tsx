// 塔罗面板：提问、牌阵选择、洗牌/发牌/3D 翻牌动画、AI 解读、复制、历史
// 移植自 fortune-site/js/tarot/view.js
import { useRef, useState } from 'react';
import { drawCards, SPREADS, type TarotDraw } from './draw';
import {
  buildTarotPrompt, fallbackTarotReading,
} from '../lib/prompt';
import { runReading } from '../lib/reading';
import { addHistory, listHistory, type HistoryEntry, type TarotHistoryData } from '../lib/settings';
import { CopyBtn, HistoryPanel, xxBtn, xxInput, xxLabel } from '../ui';

type Phase = 'idle' | 'shuffling' | 'dealing' | 'done';

function summarize(draws: TarotDraw[]): string {
  return draws.map((d) => `${d.position}·${d.card.zh}${d.reversed ? '(逆位)' : ''}`).join(' ');
}

export default function TarotPanel() {
  const [question, setQuestion] = useState('');
  const [spreadId, setSpreadId] = useState('three');
  const [phase, setPhase] = useState<Phase>('idle');
  const [draws, setDraws] = useState<TarotDraw[]>([]);
  const [openCount, setOpenCount] = useState(0);
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

  const handleDraw = async () => {
    const gen = ++genRef.current;
    skipRef.current = false;
    const d = drawCards(spreadId);
    setDraws(d);
    setOpenCount(0);
    setReading('');
    setPhase('shuffling');

    await wait(900);
    if (gen !== genRef.current) return;
    setPhase('dealing');
    await wait(260 + d.length * 180);
    for (let i = 0; i < d.length; i++) {
      if (gen !== genRef.current) return;
      setOpenCount(i + 1);
      await wait(280);
    }
    await wait(400);
    if (gen !== genRef.current) return;
    setPhase('done');
  };

  const spreadName = SPREADS[spreadId].name;

  const handleRead = async () => {
    setReadingBusy(true);
    setReading('解读中…');
    const recent = listHistory('tarot').slice(0, 2).map((e) => e.result);
    const fallback = fallbackTarotReading({ spreadName, draws });
    const text = await runReading({
      prompt: buildTarotPrompt({ question, spreadName, draws, recent }),
      fallback,
      setText: setReading,
    });
    addHistory({
      type: 'tarot',
      question: question.trim(),
      result: summarize(draws),
      reading: text,
      ts: Date.now(),
      data: { spreadName, draws },
    });
    setHistVer((v) => v + 1);
    setReadingBusy(false);
  };

  const reprompt = (entry: HistoryEntry, q: string) => {
    const d = entry.data as TarotHistoryData;
    return {
      prompt: buildTarotPrompt({ question: q, spreadName: d.spreadName, draws: d.draws }),
      fallback: fallbackTarotReading({ spreadName: d.spreadName, draws: d.draws }),
    };
  };

  const animating = phase === 'shuffling' || phase === 'dealing';

  return (
    <div>
      <div className="xx-panel">
        {xxLabel('你想问什么？（可留空）')}
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：接下来三个月的事业走向如何？"
          style={{ ...xxInput, resize: 'vertical', marginBottom: 14 }}
        />
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {Object.values(SPREADS).map((s) => (
            <button
              key={s.id}
              onClick={() => setSpreadId(s.id)}
              style={{
                ...xxBtn({ secondary: s.id !== spreadId }),
                transform: s.id === spreadId ? 'translateY(-2px)' : 'none',
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleDraw}
          disabled={animating}
          style={{ ...xxBtn(), opacity: animating ? 0.6 : 1 }}
        >
          洗牌抽牌
        </button>
      </div>

      {/* 动画区：点击可跳过 */}
      <div onClick={animating ? skipAll : undefined} style={{ cursor: animating ? 'pointer' : 'default' }}>
        {phase === 'shuffling' && (
          <div>
            <div className="xx-deck">
              <div className="xx-deck-card" />
              <div className="xx-deck-card" />
              <div className="xx-deck-card" />
            </div>
            <p className="xx-skip-hint">洗牌中…（点击可跳过动画）</p>
          </div>
        )}
        {(phase === 'dealing' || phase === 'done') && draws.length > 0 && (
          <div className="xx-tarot-board">
            {draws.map((d, i) => (
              <div key={`${d.card.id}-${i}`} className={`xx-tarot-card${i < openCount ? ' xx-open' : ''}`}>
                <div className="xx-tarot-position">{d.position}</div>
                <div className="xx-tarot-face xx-fly-in" style={{ animationDelay: `${i * 0.18}s` }}>
                  <div className="xx-tarot-inner">
                    <div className="xx-tarot-back" />
                    <img
                      className={`xx-tarot-img${d.reversed ? ' xx-img-reversed' : ''}`}
                      src={`assets/tarot/${d.card.id}.webp`}
                      alt={d.card.zh}
                      loading="lazy"
                      width={180}
                      height={320}
                    />
                  </div>
                </div>
                <div className="xx-tarot-name-under">{d.card.zh}</div>
                <div className="xx-tarot-orient">{d.reversed ? '逆位' : '正位'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {phase === 'done' && (
        <div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleRead}
              disabled={readingBusy}
              style={{ ...xxBtn(), opacity: readingBusy ? 0.6 : 1 }}
            >
              AI 解读
            </button>
            <CopyBtn getText={() => `${buildTarotPrompt({ question, spreadName, draws }).user}\n\n解读：\n${reading}`} />
          </div>
          {reading && <div className="xx-reading">{reading}</div>}
        </div>
      )}

      <HistoryPanel key={histVer} type="tarot" reprompt={reprompt} />
    </div>
  );
}
