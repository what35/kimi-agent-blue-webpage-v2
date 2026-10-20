// 塔罗/六爻提示词与本地兜底解读，移植自 fortune-site/js/core/prompt.js（只取塔罗、六爻部分）
import { GONG_INFO, najia, liuShen } from '../liuyao/najia';
import type { HexagramResult } from '../liuyao/cast';
import type { TarotDraw } from '../tarot/draw';

// 各术数共用的边界与免责约束（统一维护）
const COMMON_BOUNDARIES = `边界：涉及重大疾病、生死、法律判决、赌博投注的问题，明确告知不作预测并建议咨询专业人士；不做恐吓式解读，结论明确但不绝对化，禁止"顺其自然""保持好心态"等万能话术；结尾注明"仅供参考，人事为本"。`;

const YAO_NAMES = ['初', '二', '三', '四', '五', '上'];

export interface Prompt {
  system: string;
  user: string;
}

// 前次相关占卜（供 AI 保持连续视角，不向用户复述）
function recentBlock(recent?: string[]): string {
  if (!recent || !recent.length) return '';
  const lines = recent.map((r, i) => `${i + 1}. ${r}`);
  return `\n\n前次相关占卜（供你保持连续视角，不必向用户复述）：\n${lines.join('\n')}`;
}

// ===== 塔罗牌 =====
const TAROT_SYSTEM = `你是一位从业二十年的资深塔罗占卜师，精通伟特（Rider-Waite）牌系，熟悉占星对应、元素论与象征学，擅长以心理投射与牌面象征双重视角解牌。

解牌规范：
1. 逐牌解读：先述该牌在本位置的核心牌意（结合正逆位），再联系求问者的具体问题展开，必须引用牌面象征细节而非关键词堆砌。
2. 整体串联：分析牌阵元素分布（火水土风）、大小阿尔克那比例、宫廷牌的人格投射，指出牌面之间的呼应与矛盾。
3. 牌意演变：说明过去如何导致现在、现在的选择如何影响未来，给出趋势而非宿命。
4. 建议落地：给出 1-3 条可执行的行动建议，并提示需要警惕的心态或行为。

输出格式：【牌阵与问题回顾】【逐牌解读】【整体能量分析】【趋势研判】【行动建议】

${COMMON_BOUNDARIES}`;

export function buildTarotPrompt({ question, spreadName, draws, recent }: {
  question?: string;
  spreadName: string;
  draws: TarotDraw[];
  recent?: string[];
}): Prompt {
  const lines = draws.map((d, i) => {
    const orientation = d.reversed ? '逆位' : '正位';
    const keywords = (d.reversed ? d.card.reversed : d.card.upright).join('、');
    const imagery = d.card.imagery ? `；${d.card.imagery}` : '';
    const advice = d.card.advice ? `；建议：${d.card.advice}` : '';
    return `${i + 1}. ${d.position}：${d.card.zh}（${orientation}，关键词：${keywords}${imagery}${advice}）`;
  });
  const user = [
    `求问者的问题：${question?.trim() ? question.trim() : '（未填写，请做通用解读）'}`,
    `牌阵：${spreadName}`,
    '抽到的牌：',
    ...lines,
  ].join('\n') + recentBlock(recent);
  return { system: TAROT_SYSTEM, user };
}

// ===== 六爻 =====
const LIUYAO_SYSTEM = `你是一位精研《增删卜易》《卜筮正宗》《黄金策》的六爻预测师，深谙纳甲装卦、五行生克、六亲六神、世应关系，断卦以野鹤老人"重用神、重日月、轻穿凿"为宗。

装卦数据仅供你推理使用，输出时用白话解释关键信息，不要逐爻罗列干支与六神，让外行能看懂。

断卦规范：
1. 定用神：根据所问之事准确取用神（求财取妻财、问病取官鬼与医药、问功名取官鬼父母等），并说明取用理由。
2. 察旺衰：以月建、日辰为纲，分析用神、原神、忌神的旺相休囚，详查旬空、动爻、变爻。
3. 析生克：梳理动爻对用神的生克冲合，判断化进化退、回头生克。
4. 断应期：依据"动逢合住、空待出空、破待填实"等法则推定应验时间。
5. 综合结论：吉凶判断必须明确，不得模棱两可，同时给出趋避建议。

输出格式：【卦象排盘回顾】【用神分析】【旺衰生克】【吉凶断语】【应期推断】【建议】

${COMMON_BOUNDARIES}`;

export interface LiuyaoDateCtx {
  monthBranch: string;
  dayGZ: string;
  kong: string[];
}

export function describeLiuyao(result: HexagramResult, dateCtx?: LiuyaoDateCtx): string {
  const parts: string[] = [];
  if (dateCtx) {
    parts.push(`起卦：${dateCtx.monthBranch}月 ${dateCtx.dayGZ}日（旬空：${dateCtx.kong.join('')}）`);
  }
  const benInfo = GONG_INFO[result.ben.name];
  parts.push(`本卦：${result.ben.name}（${benInfo.gong}宫·属${benInfo.element}·${result.ben.guaci}）`);
  if (result.bian) {
    const bianInfo = GONG_INFO[result.bian.name];
    parts.push(`变卦：${result.bian.name}（${bianInfo.gong}宫·属${bianInfo.element}·${result.bian.guaci}）`);
  }
  // 装卦：纳甲六亲六神世应
  if (dateCtx) {
    const yaoLines = najia(result.ben.lower, result.ben.upper, benInfo.element);
    const bianLines = result.bian ? najia(result.bian.lower, result.bian.upper, GONG_INFO[result.bian.name].element) : null;
    const shen = liuShen(dateCtx.dayGZ[0]);
    const shi = benInfo.shi;
    const ying = ((shi + 2) % 6) + 1;
    parts.push('装卦（自下而上）：');
    for (let i = 5; i >= 0; i--) {
      const y = yaoLines[i];
      let mark = '';
      if (result.moving[i] && bianLines) {
        const changed = bianLines[i];
        mark = `${result.values[i] === 9 ? '○动' : '×动'} → ${changed.gz}${changed.qin}`;
      }
      const tag = i + 1 === shi ? '（世）' : i + 1 === ying ? '（应）' : '';
      parts.push(`${YAO_NAMES[i]}爻：${shen[i]} ${y.gz}${y.qin}${tag}${mark ? ' ' + mark : ''}`);
    }
  }
  const movingIdx = result.moving.map((m, i) => (m ? YAO_NAMES[i] : null)).filter(Boolean);
  if (movingIdx.length) {
    parts.push(`动爻：${movingIdx.join('、')}爻`);
  } else {
    parts.push('无动爻，事体稳定，以本卦卦辞断。');
  }
  return parts.join('\n');
}

export function buildLiuyaoPrompt({ question, result, dateCtx, recent }: {
  question?: string;
  result: HexagramResult;
  dateCtx?: LiuyaoDateCtx;
  recent?: string[];
}): Prompt {
  const user = [
    `求问者的问题：${question?.trim() ? question.trim() : '（未填写，请做通用解读）'}`,
    describeLiuyao(result, dateCtx),
  ].join('\n') + recentBlock(recent);
  return { system: LIUYAO_SYSTEM, user };
}

export function fallbackLiuyaoReading({ result, dateCtx }: {
  result: HexagramResult;
  dateCtx?: LiuyaoDateCtx;
}): string {
  return [
    '（未配置 AI 或请求失败，以下为本地解读）',
    describeLiuyao(result, dateCtx),
    `简释：${result.ben.brief}`,
    result.ben.duan ? `断事：${result.ben.duan}` : '',
    result.bian ? `变卦参考：${result.bian.brief}` : '',
    '结果仅供参考。',
  ].filter(Boolean).join('\n');
}

// ===== 塔罗本地降级 =====
export function fallbackTarotReading({ spreadName, draws }: {
  spreadName: string;
  draws: TarotDraw[];
}): string {
  const lines = draws.map((d) => {
    const orientation = d.reversed ? '逆位' : '正位';
    const keywords = (d.reversed ? d.card.reversed : d.card.upright).join('、');
    const extras = (d.card.imagery ? `；${d.card.imagery}` : '') + (d.card.advice ? `；${d.card.advice}` : '');
    return `【${d.position}】${d.card.zh}（${orientation}）：${keywords}${extras}`;
  });
  return [
    '（未配置 AI 或请求失败，以下为本地解读）',
    `牌阵：${spreadName}`,
    ...lines,
    '综合各位置关键词体会牌意，结果仅供参考。',
  ].join('\n');
}
