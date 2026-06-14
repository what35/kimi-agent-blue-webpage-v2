import { useRef, useEffect } from 'react';

/**
 * Memphis Geometric Background
 * Canvas-based geometric shape generator as fallback for CSS Paint API
 * Draws semi-transparent triangles, circles, and shapes in Memphis colors
 */
export default function MemphisBackground({ density = 60 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#4F8CFF', '#FFCE5C', '#86CCCA', '#5B6FA8'];

    function drawTriangle(x: number, y: number, size: number, color: string, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.866, size * 0.5);
      ctx.lineTo(size * 0.866, size * 0.5);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.restore();
    }

    function drawCircle(x: number, y: number, size: number, color: string, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.globalAlpha = Math.min(opacity * 1.5, 1);
      ctx.stroke();
      ctx.restore();
    }

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      const parent = c.parentElement;
      if (!parent) return;
      c.width = parent.offsetWidth;
      c.height = parent.offsetHeight;
      render();
    }

    function render() {
      const c = canvasRef.current;
      const cx = ctx;
      if (!c || !cx) return;
      const width = c.width;
      const height = c.height;

      cx.clearRect(0, 0, width, height);
      cx.save();

      // Light base
      cx.fillStyle = '#FAFAFA';
      cx.fillRect(0, 0, width, height);

      const shapes = ['triangle', 'triangle', 'circle', 'circle', 'dot', 'zigzag'];

      for (let i = 0; i < density; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 15 + Math.random() * 80;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = 0.05 + Math.random() * 0.15;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        if (shape === 'triangle') {
          drawTriangle(x, y, size, color, opacity);
        } else if (shape === 'circle') {
          drawCircle(x, y, size, color, opacity);
        } else {
          // Fallback: rectangle
          cx.save();
          cx.translate(x, y);
          cx.rotate(Math.random() * Math.PI * 2);
          cx.fillStyle = color;
          cx.globalAlpha = opacity;
          cx.fillRect(-size, -size * 0.2, size * 2, size * 0.4);
          cx.restore();
        }
      }

      cx.restore();
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="memphis-bg-canvas"
      style={{ opacity: 0.7 }}
    />
  );
}
