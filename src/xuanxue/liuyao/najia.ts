// 纳甲装卦、旬空、遁干、六神，移植自 fortune-site/js/liuyao/najia.js
import { GAN, ZHI } from '../lib/ganzhi';

// ===== 八宫卦序（本宫/一世/二世/三世/四世/五世/游魂/归魂） =====
// shi 为世爻位置（1-6，自下而上），应爻 = 世爻±3
const GONG_ELEMENT: Record<string, string> = { 乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土' };

const GONG_TABLE: Record<string, string[]> = {
  乾: ['乾为天', '天风姤', '天山遁', '天地否', '风地观', '山地剥', '火地晋', '火天大有'],
  坎: ['坎为水', '水泽节', '水雷屯', '水火既济', '泽火革', '雷火丰', '地火明夷', '地水师'],
  艮: ['艮为山', '山火贲', '山天大畜', '山泽损', '火泽睽', '天泽履', '风泽中孚', '风山渐'],
  震: ['震为雷', '雷地豫', '雷水解', '雷风恒', '地风升', '水风井', '泽风大过', '泽雷随'],
  巽: ['巽为风', '风天小畜', '风火家人', '风雷益', '天雷无妄', '火雷噬嗑', '山雷颐', '山风蛊'],
  离: ['离为火', '火山旅', '火风鼎', '火水未济', '山水蒙', '风水涣', '天水讼', '天火同人'],
  坤: ['坤为地', '地雷复', '地泽临', '地天泰', '雷天大壮', '泽天夬', '水天需', '水地比'],
  兑: ['兑为泽', '泽水困', '泽地萃', '泽山咸', '水山蹇', '地山谦', '雷山小过', '雷泽归妹'],
};

// 世爻位置：本宫6、一世1、二世2、三世3、四世4、五世5、游魂4、归魂3
const SHI_BY_ORDER = [6, 1, 2, 3, 4, 5, 4, 3];

export interface GongInfo {
  gong: string;
  element: string;
  shi: number;
}

export const GONG_INFO: Record<string, GongInfo> = {};
for (const [gong, names] of Object.entries(GONG_TABLE)) {
  names.forEach((name, i) => {
    GONG_INFO[name] = { gong, element: GONG_ELEMENT[gong], shi: SHI_BY_ORDER[i] };
  });
}

// ===== 纳甲装卦：各卦内外三爻干支 =====
const NAJIA: Record<string, { inner: string[]; outer: string[] }> = {
  乾: { inner: ['甲子', '甲寅', '甲辰'], outer: ['壬午', '壬申', '壬戌'] },
  坎: { inner: ['戊寅', '戊辰', '戊午'], outer: ['戊申', '戊戌', '戊子'] },
  艮: { inner: ['丙辰', '丙午', '丙申'], outer: ['丙戌', '丙子', '丙寅'] },
  震: { inner: ['庚子', '庚寅', '庚辰'], outer: ['庚午', '庚申', '庚戌'] },
  巽: { inner: ['辛丑', '辛亥', '辛酉'], outer: ['辛未', '辛巳', '辛卯'] },
  离: { inner: ['己卯', '己丑', '己亥'], outer: ['己酉', '己未', '己巳'] },
  坤: { inner: ['乙未', '乙巳', '乙卯'], outer: ['癸丑', '癸亥', '癸酉'] },
  兑: { inner: ['丁巳', '丁卯', '丁丑'], outer: ['丁亥', '丁酉', '丁未'] },
};

const WUXING_ZHI: Record<string, string> = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

function liuQin(gongElement: string, zhiElement: string): string {
  if (gongElement === zhiElement) return '兄弟';
  if (SHENG[gongElement] === zhiElement) return '子孙'; // 我生
  if (SHENG[zhiElement] === gongElement) return '父母'; // 生我
  if (KE[gongElement] === zhiElement) return '妻财';   // 我克
  return '官鬼';                                        // 克我
}

export interface NajiaYao {
  gz: string;
  qin: string;
}

// 装卦：lower/upper 为上下卦名，gongElement 为卦宫五行，返回六爻（自下而上）的 { gz, qin }
export function najia(lower: string, upper: string, gongElement: string): NajiaYao[] {
  const inner = NAJIA[lower].inner;
  const outer = NAJIA[upper].outer;
  return [...inner, ...outer].map((gz) => ({
    gz,
    qin: liuQin(gongElement, WUXING_ZHI[gz[1]]),
  }));
}

// ===== 旬空：日柱所在旬缺的两支 =====
const GZ60 = Array.from({ length: 60 }, (_, i) => GAN[i % 10] + ZHI[i % 12]);

export function xunKong(dayGZ: string): string[] {
  const idx = GZ60.indexOf(dayGZ);
  const startBranch = (idx - (idx % 10)) % 12;
  return [ZHI[(startBranch + 10) % 12], ZHI[(startBranch + 11) % 12]];
}

// ===== 遁干：以日柱所在旬遁之；旬空之支无遁干 =====
export function dunGan(zhi: string, dayGZ: string): string | null {
  const idx = GZ60.indexOf(dayGZ);
  const headIdx = idx - (idx % 10);
  const headBranch = headIdx % 12;
  const offset = (ZHI.indexOf(zhi) - headBranch + 12) % 12;
  if (offset >= 10) return null; // 旬空
  return GAN[((headIdx % 10) + offset) % 10];
}

// ===== 六神（以日干起，初爻向上） =====
const LIUSHEN = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];
const LIUSHEN_START: Record<string, number> = { 甲: 0, 乙: 0, 丙: 1, 丁: 1, 戊: 2, 己: 3, 庚: 4, 辛: 4, 壬: 5, 癸: 5 };

export function liuShen(dayGan: string): string[] {
  const start = LIUSHEN_START[dayGan];
  return Array.from({ length: 6 }, (_, i) => LIUSHEN[(start + i) % 6]);
}
