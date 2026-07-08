'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Tech {
  name: string;
  slug: string;
  color: string;       // hex without #
  proficiency: number; // 0–100
}

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tech: Tech;
  img: HTMLImageElement | null;
  imgLoaded: boolean;
  // wave animation state
  waveOffset: number;
  waveSpeed: number;
}

interface BubbleCanvasProps {
  techs: Tech[];
}

const MIN_RADIUS = 52;
const MAX_RADIUS = 78;
const DAMPING = 0.82;       // energy kept after wall bounce
const FRICTION = 0.998;     // per-frame velocity decay
const GRAVITY = 0.04;       // downward pull
const SPAWN_SPREAD = 80;    // px from center to spawn
const BUBBLE_PADDING = 2;   // gap between bubbles

export default function BubbleCanvas({ techs }: BubbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ── Helpers ────────────────────────────────────────────────────────────────

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  };

  // Draw a single bubble frame
  const drawBubble = useCallback((
    ctx: CanvasRenderingContext2D,
    b: Bubble,
    now: number
  ) => {
    const { x, y, radius, tech, img, imgLoaded, waveOffset, waveSpeed } = b;
    const rgb = hexToRgb(tech.color);
    const fillRatio = tech.proficiency / 100; // 0..1

    ctx.save();

    // ── Clip to circle ───────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    // ── Dark background of bubble ────────────────────────────────────────────
    ctx.fillStyle = `rgba(8, 11, 18, 0.92)`;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    // ── Liquid fill ─────────────────────────────────────────────────────────
    // The "water level" y-coordinate (top of the liquid, measured from bubble center)
    // fillRatio=1 → fills whole bubble; fillRatio=0 → empty
    const liquidTop = y + radius - fillRatio * radius * 2;

    // Animate a sine-wave on top of the liquid
    const waveAmplitude = Math.min(5, radius * 0.08);
    const waveFreq = (2 * Math.PI) / (radius * 1.4);
    const t = now * 0.001 * waveSpeed + waveOffset;

    ctx.beginPath();
    ctx.moveTo(x - radius, liquidTop);
    for (let px = x - radius; px <= x + radius; px += 2) {
      const wave = Math.sin((px - x) * waveFreq + t) * waveAmplitude
                 + Math.sin((px - x) * waveFreq * 0.7 - t * 0.8) * waveAmplitude * 0.5;
      ctx.lineTo(px, liquidTop + wave);
    }
    ctx.lineTo(x + radius, y + radius + 4);
    ctx.lineTo(x - radius, y + radius + 4);
    ctx.closePath();

    // Liquid gradient — brand color at mid-opacity
    const liquidGrad = ctx.createLinearGradient(x, liquidTop, x, y + radius);
    liquidGrad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.55)`);
    liquidGrad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.30)`);
    ctx.fillStyle = liquidGrad;
    ctx.fill();

    // ── Logo ─────────────────────────────────────────────────────────────────
    if (imgLoaded && img) {
      const logoSize = radius * 0.72;
      ctx.globalAlpha = 0.92;
      ctx.drawImage(img, x - logoSize / 2, y - logoSize / 2, logoSize, logoSize);
      ctx.globalAlpha = 1;
    } else {
      // Fallback text
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)`;
      ctx.font = `bold ${Math.floor(radius * 0.32)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.name.slice(0, 2).toUpperCase(), x, y);
    }

    ctx.restore();

    // ── Bubble glass rim (drawn outside clip) ────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    // Outer border glow
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.6)`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.5)`;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner highlight arc (top-left sheen)
    ctx.beginPath();
    ctx.arc(x - radius * 0.2, y - radius * 0.25, radius * 0.55, -Math.PI * 0.75, -Math.PI * 0.1);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = radius * 0.18;
    ctx.stroke();

    // Name label
    ctx.fillStyle = 'rgba(240,244,255,0.85)';
    ctx.font = `500 ${Math.floor(radius * 0.22)}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(tech.name, x, y + radius * 0.70);

    // Proficiency % label
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.85)`;
    ctx.font = `600 ${Math.floor(radius * 0.20)}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`${tech.proficiency}%`, x, y + radius * 0.88);

    ctx.restore();
  }, []);

  // ── Physics step ────────────────────────────────────────────────────────────
  const step = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const bubbles = bubblesRef.current;

    // Clear
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];

      // Gravity
      b.vy += GRAVITY;

      // Move
      b.x += b.vx;
      b.y += b.vy;

      // Friction
      b.vx *= FRICTION;
      b.vy *= FRICTION;

      // Wall collisions
      if (b.x - b.radius < 0) {
        b.x = b.radius;
        b.vx = Math.abs(b.vx) * DAMPING;
      } else if (b.x + b.radius > w) {
        b.x = w - b.radius;
        b.vx = -Math.abs(b.vx) * DAMPING;
      }
      if (b.y - b.radius < 0) {
        b.y = b.radius;
        b.vy = Math.abs(b.vy) * DAMPING;
      } else if (b.y + b.radius > h) {
        b.y = h - b.radius;
        b.vy = -Math.abs(b.vy) * DAMPING;
      }

      // Bubble-to-bubble collisions
      for (let j = i + 1; j < bubbles.length; j++) {
        const b2 = bubbles[j];
        const dx = b2.x - b.x;
        const dy = b2.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b.radius + b2.radius + BUBBLE_PADDING;

        if (dist < minDist && dist > 0.01) {
          // Push apart
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          b.x -= nx * overlap;
          b.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;

          // Elastic velocity exchange along normal
          const dvx = b.vx - b2.vx;
          const dvy = b.vy - b2.vy;
          const dot = dvx * nx + dvy * ny;
          if (dot > 0) {
            const impulse = dot * DAMPING;
            b.vx -= impulse * nx;
            b.vy -= impulse * ny;
            b2.vx += impulse * nx;
            b2.vy += impulse * ny;
          }
        }
      }
    }

    // Draw all bubbles
    for (const b of bubbles) {
      b.waveOffset; // accessed to avoid lint warning — waveOffset is set at init
      drawBubble(ctx, b, now);
    }

    rafRef.current = requestAnimationFrame(step);
  }, [drawBubble]);

  // ── Init bubbles ────────────────────────────────────────────────────────────
  const initBubbles = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;

    bubblesRef.current = techs.map((tech, i) => {
      const angle = (i / techs.length) * Math.PI * 2;
      const r = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);

      // spawn near center with outward velocity
      const spawnX = cx + Math.cos(angle) * SPAWN_SPREAD * Math.random();
      const spawnY = cy + Math.sin(angle) * SPAWN_SPREAD * Math.random();
      const speed = 4 + Math.random() * 6;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      const bubble: Bubble = {
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: r,
        tech,
        img,
        imgLoaded: false,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: 0.6 + Math.random() * 0.8,
      };

      img.onload = () => { bubble.imgLoaded = true; };
      img.onerror = () => { bubble.imgLoaded = false; };
      img.src = `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;

      return bubble;
    });
  }, [techs]);

  // ── Resize handler ──────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { w, h };
  }, []);

  // ── Mount / unmount ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    const { w, h } = sizeRef.current;
    initBubbles(w, h);

    rafRef.current = requestAnimationFrame(step);

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [handleResize, initBubbles, step]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
