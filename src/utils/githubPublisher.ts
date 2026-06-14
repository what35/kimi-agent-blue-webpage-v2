const OWNER = 'what35';
const REPO = 'kimi-agent-blue-webpage-v2';
const FILE_PATH = 'src/data/siteData.ts';
const BRANCH = 'main';

export interface PublishResult {
  ok: boolean;
  message: string;
  commitUrl?: string;
}

function btoaUnicode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(Number.parseInt(p1, 16))));
}

export async function publishToGitHub(token: string, content: string, message = 'content: update from admin panel'): Promise<PublishResult> {
  if (!token.trim()) {
    return { ok: false, message: 'GitHub Token 不能为空' };
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // 1. Get current file SHA
    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, { headers });
    if (!getRes.ok) {
      const err = await getRes.json().catch(() => ({}));
      return { ok: false, message: `获取文件失败: ${err.message || getRes.statusText}` };
    }
    const fileInfo = await getRes.json();
    const sha = fileInfo.sha;

    // 2. Update file
    const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message,
        content: btoaUnicode(content),
        sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      return { ok: false, message: `提交失败: ${err.message || putRes.statusText}` };
    }

    const result = await putRes.json();
    return {
      ok: true,
      message: '发布成功，Cloudflare 正在重新部署',
      commitUrl: result.commit?.html_url,
    };
  } catch (e) {
    return { ok: false, message: `网络错误: ${e instanceof Error ? e.message : String(e)}` };
  }
}
