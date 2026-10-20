// 干支与四柱最小切片：只保留六爻起卦所需的月建/日干支/旬空上下文
// 来源：fortune-site/js/liuren/ganzhi.js + js/liuren/jieqi.js + js/bazi/pillars.js
import { JIEQI } from './jieqi-table';

export const GAN = '甲乙丙丁戊己庚辛壬癸'.split('');
export const ZHI = '子丑寅卯辰巳午未申酉戌亥'.split('');

// 锚点：1900-01-01 为甲戌日（六十甲子序号 10）
const ANCHOR_UTC = Date.UTC(1900, 0, 1);
const ANCHOR_INDEX = 10;

export function dayGanzhi(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const days = Math.round((Date.UTC(y, m - 1, d) - ANCHOR_UTC) / 86400000);
  const idx = (((ANCHOR_INDEX + days) % 60) + 60) % 60;
  return GAN[idx % 10] + ZHI[idx % 12];
}

// 五鼠遁：甲己日起甲子时，乙庚丙子，丙辛戊子，丁壬庚子，戊癸壬子
export function hourGanzhi(dayGan: string, hour: number): string {
  const zhiIdx = Math.floor(((hour + 1) % 24) / 2);
  const ziGan = (GAN.indexOf(dayGan) % 5) * 2;
  return GAN[(ziGan + zhiIdx) % 10] + ZHI[zhiIdx];
}

const JIE = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
const JIE_BRANCH: Record<string, string> = {
  立春: '寅', 惊蛰: '卯', 清明: '辰', 立夏: '巳', 芒种: '午', 小暑: '未',
  立秋: '申', 白露: '酉', 寒露: '戌', 立冬: '亥', 大雪: '子', 小寒: '丑',
};

export function latestTermWhere(dateStr: string, pred: (name: string) => boolean): [string, string] {
  for (let i = JIEQI.length - 1; i >= 0; i--) {
    if (JIEQI[i][0] <= dateStr && pred(JIEQI[i][1])) return JIEQI[i];
  }
  throw new Error(`date out of range: ${dateStr}`);
}

export interface FourPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export function fourPillars(dateStr: string, hour: number | null): FourPillars {
  const day = dayGanzhi(dateStr);
  const y = Number(dateStr.slice(0, 4));
  const lichun = JIEQI.find(([d, n]) => n === '立春' && d.startsWith(String(y)));
  const year = lichun && dateStr < lichun[0] ? y - 1 : y;
  const yearIdx = (((year - 4) % 60) + 60) % 60;
  const yearGZ = GAN[yearIdx % 10] + ZHI[yearIdx % 12];
  const jie = latestTermWhere(dateStr, (name) => JIE.includes(name))[1];
  const monthBranch = JIE_BRANCH[jie];
  const mIdx = (ZHI.indexOf(monthBranch) - 2 + 12) % 12;
  const monthGanIdx = (((yearIdx % 10) % 5) * 2 + 2 + mIdx) % 10;
  let hourDayGan = day[0];
  if (hour === 23) {
    const [yy, mm, dd] = dateStr.split('-').map(Number);
    const next = new Date(Date.UTC(yy, mm - 1, dd + 1));
    const nextStr = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`;
    hourDayGan = dayGanzhi(nextStr)[0];
  }
  const hourGZ = hour === null ? '??' : hourGanzhi(hourDayGan, hour);
  return { year: yearGZ, month: GAN[monthGanIdx] + monthBranch, day, hour: hourGZ };
}
