// 统一的 AI 解读执行：流式渲染，失败/未配置降级本地文案
// 移植自 fortune-site/js/core/views-shared.js 的 runReading
import { createLlmClient } from './llm';
import { loadSettings } from './settings';
import type { Prompt } from './prompt';

export async function runReading({ prompt, fallback, setText }: {
  prompt: Prompt;
  fallback: string;
  setText: (text: string) => void;
}): Promise<string> {
  const settings = loadSettings();
  if (!settings.apiKey) {
    setText(fallback);
    return fallback;
  }
  let acc = '';
  let firstToken = false;
  const started = Date.now();
  setText('解读中…');
  const timer = setInterval(() => {
    if (!firstToken) setText(`解读中…（已等待 ${Math.floor((Date.now() - started) / 1000)} 秒）`);
  }, 1000);
  try {
    const llm = createLlmClient(settings);
    const text = await llm.chat({
      ...prompt,
      onToken: (t) => {
        if (!firstToken) {
          firstToken = true;
          acc = '';
        }
        acc += t;
        setText(acc);
      },
      onReset: () => { acc = ''; setText(''); },
    });
    if (!text.trim()) {
      setText(fallback);
      return fallback;
    }
    return text;
  } catch (e) {
    const msg = `（AI 解读失败：${e instanceof Error ? e.message : String(e)}）\n\n${fallback}`;
    setText(msg);
    return msg;
  } finally {
    clearInterval(timer);
  }
}
