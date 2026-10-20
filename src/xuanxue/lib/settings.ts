// BYOK 设置与历史记录：全部存 localStorage，仅存于本机浏览器
// 预设移植自 fortune-site/js/core/providers.js
import type { TarotDraw } from '../tarot/draw';
import type { HexagramResult } from '../liuyao/cast';
import type { LiuyaoDateCtx } from './prompt';

export interface LlmProvider {
  id: string;
  name: string;
  baseUrl: string;
  model: string;
}

export const PROVIDERS: LlmProvider[] = [
  { id: 'moonshot', name: 'Kimi 开放平台（按量付费）', baseUrl: 'https://api.moonshot.cn/v1', model: 'kimi-k2-0711-preview' },
  { id: 'kimi-code', name: 'Kimi Code（会员编程版）', baseUrl: 'https://api.kimi.com/coding/v1', model: 'kimi-for-coding' },
  { id: 'deepseek', name: 'DeepSeek（深度求索）', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'qwen', name: '通义千问（阿里）', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { id: 'zhipu', name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'mimo', name: '小米 MiMo', baseUrl: 'https://token-plan-cn.xiaomimimo.com/v1', model: 'mimo-v2.6' },
  { id: 'custom', name: '自定义（OpenAI 兼容）', baseUrl: '', model: '' },
];

export function getProvider(id: string): LlmProvider {
  const p = PROVIDERS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown provider: ${id}`);
  return p;
}

// ===== 设置读写 =====
export interface XuanxueSettings {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

const SETTINGS_KEY = 'xuanxue-settings';
const DEFAULTS: XuanxueSettings = {
  provider: 'moonshot',
  baseUrl: 'https://api.moonshot.cn/v1',
  apiKey: '',
  model: 'kimi-k2-0711-preview',
};

export function loadSettings(): XuanxueSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<XuanxueSettings>) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(s: XuanxueSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ===== 历史记录（tarot / liuyao 分开存，各留最近 50 条） =====
export type HistoryType = 'tarot' | 'liuyao';

export interface TarotHistoryData {
  spreadName: string;
  draws: TarotDraw[];
}

export interface LiuyaoHistoryData {
  result: HexagramResult;
  dateCtx?: LiuyaoDateCtx;
}

export interface HistoryEntry {
  id: string;
  type: HistoryType;
  question: string;
  result: string;
  reading: string;
  ts: number;
  data?: TarotHistoryData | LiuyaoHistoryData;
}

const HISTORY_KEYS: Record<HistoryType, string> = {
  tarot: 'xuanxue-history-tarot',
  liuyao: 'xuanxue-history-liuyao',
};
const HISTORY_LIMIT = 50;

export function listHistory(type: HistoryType): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEYS[type]);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeHistory(type: HistoryType, items: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEYS[type], JSON.stringify(items.slice(0, HISTORY_LIMIT)));
}

export function addHistory(entry: Omit<HistoryEntry, 'id'>): HistoryEntry {
  const full: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
  writeHistory(entry.type, [full, ...listHistory(entry.type)]);
  return full;
}

export function removeHistory(type: HistoryType, id: string): HistoryEntry[] {
  const items = listHistory(type).filter((e) => e.id !== id);
  writeHistory(type, items);
  return items;
}

export function clearHistory(type: HistoryType): void {
  localStorage.removeItem(HISTORY_KEYS[type]);
}
