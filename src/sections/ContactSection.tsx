import { useState, useEffect, useRef } from 'react';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const revealEls = sectionRef.current?.querySelectorAll('.scroll-reveal');
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`来自 ${name} 的留言`);
    const body = encodeURIComponent(`发件人：${name}\n邮箱：${email}\n\n${message}`);
    window.location.href = `mailto:781775871@qq.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '140px 24px 100px',
        maxWidth: 700,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: 48, '--start-rotate': '1deg' } as React.CSSProperties}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--memphis-purple)',
          transform: 'rotate(1deg)', marginBottom: 12,
          textShadow: '3px 3px 0 #000', display: 'inline-block',
        }}>
          联系我
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#666', lineHeight: 1.6 }}>
          有缘自会相见，也可以写邮件给我
        </p>
      </div>

      {/* Mailto Form */}
      <div className="scroll-reveal" style={{ '--start-rotate': '-1deg' } as React.CSSProperties}>
        <div style={{
          position: 'relative', background: '#fff', border: '3px solid #000',
          borderRadius: 12, padding: '36px 32px', boxShadow: '8px 8px 0 rgba(106, 123, 180, 0.3)',
        }}>
          {/* To field - hidden email */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#666', flexShrink: 0 }}>
              收件人
            </span>
            <div style={{
              flex: 1, padding: '10px 14px', background: 'var(--memphis-teal)20', border: '2px solid #000',
              borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span style={{ letterSpacing: '0.02em' }}>
                {showEmail ? '781775871@qq.com' : '78****871@qq.com'}
              </span>
              <button
                type="button"
                onClick={() => setShowEmail(!showEmail)}
                style={{
                  padding: '3px 10px', background: showEmail ? 'var(--memphis-primary)' : '#f0f0f0',
                  color: showEmail ? '#fff' : '#666', border: '1.5px solid #000',
                  borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-display)',
                  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {showEmail ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                你的名字
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="怎么称呼你？"
                required
                className="memphis-input-wave"
                style={{ borderRadius: '4px 12px 4px 12px' }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                你的邮箱
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="memphis-input-wave"
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                想说的话
              </label>
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="写点什么..."
                rows={4} required
                className="memphis-input-wave"
                style={{ borderRadius: '12px 4px 12px 4px', resize: 'vertical' }}
              />
            </div>

            {/* Submit button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button
                type="submit"
                className={`triangle-submit ${submitted ? 'success' : ''}`}
                disabled={submitted}
              >
                {submitted ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ marginRight: 6 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    已发送
                  </>
                ) : (
                  '发送邮件'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="memphis-float memphis-float--circle" style={{
        top: '15%', left: '5%',
        '--float-duration': '22s', '--float-delay': '0s', '--float-distance': '-18px',
        background: 'var(--memphis-primary)',
      } as React.CSSProperties} />
      <div className="memphis-float memphis-float--triangle" style={{
        bottom: '10%', right: '8%',
        '--float-duration': '19s', '--float-delay': '3s', '--float-distance': '-20px',
        background: 'var(--memphis-teal)',
      } as React.CSSProperties} />
    </section>
  );
}
