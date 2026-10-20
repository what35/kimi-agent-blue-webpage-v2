// 六爻摇卦与排卦，移植自 fortune-site/js/liuyao/cast.js
import { HEXAGRAMS } from './hexagrams';
import type { Hexagram } from './hexagrams';

export interface Trigram {
  lines: number[];
  element: string;
  symbol: string;
}

// 八卦：lines 自下而上，1 为阳爻，0 为阴爻
export const TRIGRAMS: Record<string, Trigram> = {
  乾: { lines: [1, 1, 1], element: '金', symbol: '天' },
  兑: { lines: [1, 1, 0], element: '金', symbol: '泽' },
  离: { lines: [1, 0, 1], element: '火', symbol: '火' },
  震: { lines: [1, 0, 0], element: '木', symbol: '雷' },
  巽: { lines: [0, 1, 1], element: '木', symbol: '风' },
  坎: { lines: [0, 1, 0], element: '水', symbol: '水' },
  艮: { lines: [0, 0, 1], element: '土', symbol: '山' },
  坤: { lines: [0, 0, 0], element: '土', symbol: '地' },
};

function trigramName(lines3: number[]): string {
  const key = lines3.join('');
  for (const [name, t] of Object.entries(TRIGRAMS)) {
    if (t.lines.join('') === key) return name;
  }
  throw new Error(`no trigram for lines ${key}`);
}

// 三枚铜钱：字面为 3，背面为 2，三枚之和为 6/7/8/9
export function castCoins(rng: () => number = Math.random): number {
  let sum = 0;
  for (let i = 0; i < 3; i++) sum += rng() < 0.5 ? 3 : 2;
  return sum;
}

export function lookupHexagram(lines: number[]): Hexagram {
  if (lines.length !== 6) throw new Error('lookupHexagram requires 6 lines');
  const lower = trigramName(lines.slice(0, 3));
  const upper = trigramName(lines.slice(3, 6));
  const h = HEXAGRAMS.find((x) => x.upper === upper && x.lower === lower);
  if (!h) throw new Error(`no hexagram for ${upper}/${lower}`);
  return h;
}

export interface HexagramResult {
  values: number[];
  lines: number[];
  moving: boolean[];
  ben: Hexagram;
  bian: Hexagram | null;
}

// values: 6 个 6-9 值，自下而上。7 少阳、8 少阴、6 老阴(动)、9 老阳(动)
export function buildHexagram(values: number[]): HexagramResult {
  if (values.length !== 6) throw new Error('buildHexagram requires 6 values');
  for (const v of values) {
    if (![6, 7, 8, 9].includes(v)) throw new Error(`value must be 6, 7, 8 or 9, got ${v}`);
  }
  const lines = values.map((v) => (v === 7 || v === 9 ? 1 : 0));
  const moving = values.map((v) => v === 6 || v === 9);
  const ben = lookupHexagram(lines);
  const bian = moving.some(Boolean)
    ? lookupHexagram(lines.map((l, i) => (moving[i] ? 1 - l : l)))
    : null;
  return { values: [...values], lines, moving, ben, bian };
}
