// 塔罗洗牌与抽牌，移植自 fortune-site/js/tarot/draw.js
import { TAROT_CARDS } from './cards';
import type { TarotCard } from './cards';

export function shuffle<T>(deck: T[], rng: () => number = Math.random): T[] {
  const a = [...deck];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Spread {
  id: string;
  name: string;
  positions: string[];
}

export const SPREADS: Record<string, Spread> = {
  single: { id: 'single', name: '单张牌', positions: ['指引'] },
  three: { id: 'three', name: '三张牌', positions: ['过去', '现在', '未来'] },
};

export interface TarotDraw {
  position: string;
  card: TarotCard;
  reversed: boolean;
}

export function drawCards(spreadId: string, rng: () => number = Math.random): TarotDraw[] {
  const spread = SPREADS[spreadId];
  if (!spread) throw new Error(`unknown spread: ${spreadId}`);
  const deck = shuffle(TAROT_CARDS, rng);
  return spread.positions.map((position, i) => ({
    position,
    card: deck[i],
    reversed: rng() < 0.5,
  }));
}
