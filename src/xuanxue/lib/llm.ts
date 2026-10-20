// OpenAI 兼容的 /chat/completions 客户端：流式优先，失败重试一次
// 移植自 fortune-site/js/core/llm.js
export interface LlmClientOptions {
  baseUrl: string;
  apiKey: string;
  model: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface ChatArgs {
  system: string;
  user: string;
  onToken?: (token: string) => void;
  onReset?: () => void;
}

interface StreamChoice {
  choices?: Array<{ delta?: { content?: string } }>;
}

interface FullChoice {
  choices?: Array<{ message?: { content?: string } }>;
}

export function createLlmClient({ baseUrl, apiKey, model, fetchImpl = fetch, timeoutMs = 30000 }: LlmClientOptions) {
  async function requestOnce({ system, user, onToken }: ChatArgs): Promise<string> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      });
      if (!res.ok) throw new Error(`LLM 请求失败: HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        return await readStream(res.body, onToken);
      }
      const data = (await res.json()) as FullChoice;
      const text = data.choices?.[0]?.message?.content ?? '';
      if (text && onToken) onToken(text);
      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  async function readStream(body: ReadableStream<Uint8Array>, onToken?: (token: string) => void): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let full = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const payload = t.slice(5).trim();
        if (payload === '[DONE]') return full;
        try {
          const token = (JSON.parse(payload) as StreamChoice).choices?.[0]?.delta?.content;
          if (token) {
            full += token;
            if (onToken) onToken(token);
          }
        } catch {
          // 忽略不完整的数据行
        }
      }
    }
    return full;
  }

  async function chat(args: ChatArgs): Promise<string> {
    if (!apiKey) throw new Error('未配置 API Key，请先到「设置」里填写');
    try {
      return await requestOnce(args);
    } catch {
      // 失败重试一次；若第一次已流出部分内容，通知上层复位再重试
      args.onReset?.();
      return await requestOnce(args);
    }
  }

  return { chat };
}
