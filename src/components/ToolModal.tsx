import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import type { Tool } from '../data/siteData';

interface ToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

/** Auto-convert video URLs to embed URLs */
function getEmbedUrl(url: string): string {
  if (!url) return '';
  // Bilibili: https://www.bilibili.com/video/BV1xx → embed
  const biliMatch = url.match(/bilibili\.com\/video\/(BV\w+)/);
  if (biliMatch) {
    return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1&high_quality=1`;
  }
  // YouTube: https://www.youtube.com/watch?v=xxxx → embed
  const ytMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

export default function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        if (overlayRef.current) overlayRef.current.classList.add('is-open');
      });
    } else {
      if (overlayRef.current) overlayRef.current.classList.remove('is-open');
      const timer = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!tool) return null;

  const htmlDocs = marked.parse(tool.docs) as string;
  const embedUrl = tool.media.video ? getEmbedUrl(tool.media.video) : '';

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      style={{ display: isOpen ? 'flex' : 'none' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-content"
        style={{ '--device-primary': tool.memphis.primary, '--device-accent': tool.memphis.accent } as React.CSSProperties}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `3px solid ${tool.memphis.primary}` }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, margin: 0 }}>
              {tool.name}
            </h2>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#666', marginTop: 4, display: 'inline-block' }}>
              {tool.category}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #000', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, transition: 'transform 0.2s, background 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(90deg)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--memphis-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
            aria-label="关闭"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Video Area — supports Bilibili & YouTube auto-embed */}
        {embedUrl && (
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: 8, border: '3px solid #000', overflow: 'hidden' }}>
              <iframe
                src={embedUrl}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                title={`${tool.name} 演示视频`}
              />
            </div>
          </div>
        )}

        {/* Hint when no video */}
        {!tool.media.video && (
          <div style={{ margin: '12px 24px', padding: '10px 14px', background: '#f5f5f5', border: '1px dashed #999', borderRadius: 6, fontSize: 12, color: '#888' }}>
            可在管理后台粘贴 Bilibili / YouTube 视频链接自动嵌入播放
          </div>
        )}

        {/* Docs - Markdown */}
        <div style={{ padding: '20px 24px' }}>
          <div
            className="markdown-docs"
            dangerouslySetInnerHTML={{ __html: htmlDocs }}
            style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7 }}
          />
        </div>

        {/* Download Panel */}
        <div style={{ padding: '20px 24px', background: `${tool.memphis.primary}20`, borderTop: '2px solid #000' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="version-tag">v{tool.download.version}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#666' }}>{tool.download.size}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#999' }}>更新于 {tool.updated}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {tool.download.platforms.map((platform) => (
              <span key={platform} className="platform-tag">
                {platform === 'mac' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                {platform === 'win' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12V6.75l6-1.32v6.48L3 12m17-9v8.75l-10 .15V5.21L20 3M3 13l6 .09v6.81l-6-1.15V13m17 .25V22l-10-1.91V13.1l10 .15z"/></svg>}
                {platform === 'web' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                {platform}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={tool.download.file} style={{ padding: '10px 24px', background: tool.memphis.primary, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, border: '2px solid #000', borderRadius: 6, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '3px 3px 0 #000' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              下载
            </a>
            <a href={tool.media.video || '#'} style={{ padding: '10px 24px', background: '#fff', color: 'var(--color-text)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, border: '2px solid #000', borderRadius: 6, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'transform 0.2s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              演示视频
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
