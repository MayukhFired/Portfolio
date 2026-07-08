'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Tech {
  name: string;
  slug: string;
  color: string;       // hex WITHOUT '#'
  proficiency: number; // 0–100
}

interface Bubble {
  // current position & velocity
  x: number;
  y: number;
  vx: number;
  vy: number;
  // home (magnetic) position — bubble always wants to return here
  hx: number;
  hy: number;
  radius: number;
  tech: Tech;
  img: HTMLImageElement | null;
  imgLoaded: boolean;
  // wave animation
  waveOffset: number;
  waveSpeed: number;
  // state
  launched: boolean;   // true while bouncing freely
  snapTimer: number;   // counts down after returning near home
}

interface BubbleCanvasProps {
  techs: Tech[];
}

// ── Physics constants ────────────────────────────────────────────────────────
const BUBBLE_RADIUS   = 62;          // uniform radius — keeps pack tight
const PACK_PADDING    = 4;           // gap between bubbles in packed layout
const SPRING_K        = 0.045;       // spring stiffness (home attraction)
const SPRING_DAMP     = 0.82;        // velocity damping each frame
const WALL_BOUNCE     = 0.75;        // energy kept on wall collision
const LAUNCH_SPEED    = 14;          // px/frame initial launch velocity
const SNAP_DIST       = 6;           // px — bubble snaps home when this close
const SNAP_FRAMES     = 18;          // frames at rest before snapping
const BUBBLE_BOUNCE   = 0.6;         // energy kept on bubble-bubble collision

// ── Hex helper ───────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

// ── Packed-circle layout (row-based hexagonal packing) ───────────────────────
function computeHomePositions(
  count: number,
  radius: number,
  canvasW: number,
  canvasH: number,
): { hx: number; hy: number }[] {
  const diameter = radius * 2 + PACK_PADDING;
  const rowH     = diameter * Math.sqrt(3) / 2; // hex row height

  // How many columns fit?
  const cols = Math.max(1, Math.floor(canvasW / diameter));

  const positions: { hx: number; hy: number }[] = [];
  let i = 0;
  let row = 0;

  while (i < count) {
    const offset = (row % 2) * (diameter / 2); // hex stagger
    for (let col = 0; col < cols && i < count; col++, i++) {
      positions.push({
        hx: offset + col * diameter + diameter / 2,
        hy: row * rowH + diameter / 2,
      });
    }
    row++;
  }

  // Center the whole pack inside the canvas
  const minX = Math.min(...positions.map(p => p.hx)) - radius;
  const maxX = Math.max(...positions.map(p => p.hx)) + radius;
  const minY = Math.min(...positions.map(p => p.hy)) - radius;
  const maxY = Math.max(...positions.map(p => p.hy)) + radius;
  const packW = maxX - minX;
  const packH = maxY - minY;
  const shiftX = (canvasW - packW) / 2 - minX;
  const shiftY = (canvasH - packH) / 2 - minY;

  return positions.map(p => ({ hx: p.hx + shiftX, hy: p.hy + shiftY }));
}

export default function BubbleCanvas({ techs }: BubbleCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef     = useRef<number>(0);
  const sizeRef    = useRef({ w: 0, h: 0 });
  const visibleRef = useRef(true);

  // ── Draw one bubble ─────────────────────────────────────────────────────────
  const drawBubble = useCallback((
    ctx: CanvasRenderingContext2D,
    b: Bubble,
    now: number,
  ) => {
    const { x, y, radius, tech, img, imgLoaded, waveOffset, waveSpeed } = b;
    const rgb       = hexToRgb(tech.color);
    const fillRatio = tech.proficiency / 100;

    // ── Clipped interior ────────────────────────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    // dark bg
    ctx.fillStyle = 'rgba(8,11,18,0.93)';
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    // liquid fill
    const liquidTop    = y + radius - fillRatio * radius * 2;
    const waveAmp      = Math.min(5, radius * 0.08);
    const waveFreq     = (Math.PI * 2) / (radius * 1.4);
    const t            = now * 0.001 * waveSpeed + waveOffset;

    ctx.beginPath();
    ctx.moveTo(x - radius, liquidTop);
    for (let px = x - radius; px <= x + radius; px += 2) {
      const wave = Math.sin((px - x) * waveFreq + t) * waveAmp
                 + Math.sin((px - x) * waveFreq * 0.7 - t * 0.8) * waveAmp * 0.5;
      ctx.lineTo(px, liquidTop + wave);
    }
    ctx.lineTo(x + radius, y + radius + 4);
    ctx.lineTo(x - radius, y + radius + 4);
    ctx.closePath();
    const grad = ctx.createLinearGradient(x, liquidTop, x, y + radius);
    grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.55)`);
    grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0.28)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // logo
    if (imgLoaded && img) {
      const s = radius * 0.72;
      ctx.globalAlpha = 0.92;
      ctx.drawImage(img, x - s / 2, y - s / 2, s, s);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)`;
      ctx.font = `bold ${Math.floor(radius * 0.32)}px "JetBrains Mono",monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.name.slice(0, 2).toUpperCase(), x, y);
    }

    ctx.restore();

    // ── Glass rim + labels (outside clip) ───────────────────────────────────
    ctx.save();

    // glow border
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.65)`;
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`;
    ctx.shadowBlur  = b.launched ? 22 : 12;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // sheen
    ctx.beginPath();
    ctx.arc(x - radius * 0.2, y - radius * 0.25, radius * 0.55,
            -Math.PI * 0.75, -Math.PI * 0.1);
    ctx.strokeStyle = 'rgba(255,255,255,0.11)';
    ctx.lineWidth   = radius * 0.18;
    ctx.stroke();

    // name
    ctx.fillStyle    = 'rgba(240,244,255,0.88)';
    ctx.font         = `500 ${Math.floor(radius * 0.22)}px "Space Grotesk",sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(tech.name, x, y + radius * 0.70);

    // proficiency %
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
    ctx.font      = `600 ${Math.floor(radius * 0.20)}px "JetBrains Mono",monospace`;
    ctx.fillText(`${tech.proficiency}%`, x, y + radius * 0.88);

    ctx.restore();
  }, []);

  // ── Physics step ─────────────────────────────────────────────────────────────
  const step = useCallback((now: number) => {
    rafRef.current = requestAnimationFrame(step);

    if (!visibleRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const bubbles   = bubblesRef.current;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];

      if (b.launched) {
        // ── Spring force toward home ───────────────────────────────────────
        const dx = b.hx - b.x;
        const dy = b.hy - b.y;
        b.vx += dx * SPRING_K;
        b.vy += dy * SPRING_K;

        // Dampen velocity
        b.vx *= SPRING_DAMP;
        b.vy *= SPRING_DAMP;

        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Wall bounces
        if (b.x - b.radius < 0)  { b.x = b.radius;     b.vx =  Math.abs(b.vx) * WALL_BOUNCE; }
        if (b.x + b.radius > w)  { b.x = w - b.radius; b.vx = -Math.abs(b.vx) * WALL_BOUNCE; }
        if (b.y - b.radius < 0)  { b.y = b.radius;     b.vy =  Math.abs(b.vy) * WALL_BOUNCE; }
        if (b.y + b.radius > h)  { b.y = h - b.radius; b.vy = -Math.abs(b.vy) * WALL_BOUNCE; }

        // Bubble-bubble collisions (only launched bubble vs others)
        for (let j = 0; j < bubbles.length; j++) {
          if (i === j) continue;
          const b2 = bubbles[j];
          const cdx  = b2.x - b.x;
          const cdy  = b2.y - b.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);
          const min  = b.radius + b2.radius + PACK_PADDING;
          if (dist < min && dist > 0.01) {
            const overlap = (min - dist) / 2;
            const nx = cdx / dist;
            const ny = cdy / dist;
            b.x  -= nx * overlap;
            b.y  -= ny * overlap;
            b2.x += nx * overlap * 0.3; // push neighbour only slightly
            b2.y += ny * overlap * 0.3;
            // Exchange velocity along normal
            const rel = (b.vx - b2.vx) * nx + (b.vy - b2.vy) * ny;
            if (rel > 0) {
              b.vx  -= rel * nx * BUBBLE_BOUNCE;
              b.vy  -= rel * ny * BUBBLE_BOUNCE;
              b2.vx += rel * nx * BUBBLE_BOUNCE * 0.3;
              b2.vy += rel * ny * BUBBLE_BOUNCE * 0.3;
            }
          }
        }

        // Check if close enough to home to snap back
        const distHome = Math.sqrt((b.x - b.hx) ** 2 + (b.y - b.hy) ** 2);
        const speed    = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (distHome < SNAP_DIST && speed < 1) {
          b.snapTimer++;
          if (b.snapTimer >= SNAP_FRAMES) {
            b.x       = b.hx;
            b.y       = b.hy;
            b.vx      = 0;
            b.vy      = 0;
            b.launched  = false;
            b.snapTimer = 0;
          }
        } else {
          b.snapTimer = 0;
        }

      } else {
        // ── Magnetic — sit exactly at home, tiny idle float ─────────────────
        const idleAmp = 1.8;
        const idleT   = now * 0.0008 + b.waveOffset;
        b.x = b.hx + Math.sin(idleT)             * idleAmp;
        b.y = b.hy + Math.sin(idleT * 0.7 + 1.2) * idleAmp;
      }
    }

    // Draw all
    for (const b of bubbles) drawBubble(ctx, b, now);

  }, [drawBubble]);

  // ── Init bubbles ─────────────────────────────────────────────────────────────
  const initBubbles = useCallback((w: number, h: number) => {
    const homes = computeHomePositions(techs.length, BUBBLE_RADIUS, w, h);

    bubblesRef.current = techs.map((tech, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const bubble: Bubble = {
        x:          homes[i].hx,
        y:          homes[i].hy,
        vx:         0,
        vy:         0,
        hx:         homes[i].hx,
        hy:         homes[i].hy,
        radius:     BUBBLE_RADIUS,
        tech,
        img,
        imgLoaded:  false,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed:  0.6 + Math.random() * 0.8,
        launched:   false,
        snapTimer:  0,
      };

      img.onload  = () => { bubble.imgLoaded = true; };
      img.onerror = () => { bubble.imgLoaded = false; };
      img.src = `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;

      return bubble;
    });
  }, [techs]);

  // ── Click / tap handler ──────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px   = e.clientX - rect.left;
    const py   = e.clientY - rect.top;

    for (const b of bubblesRef.current) {
      const dx   = px - b.x;
      const dy   = py - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= b.radius) {
        // Launch outward from click point with a bit of randomness
        const angle  = Math.atan2(dy - b.radius * 0.3, dx - b.radius * 0.3)
                      + (Math.random() - 0.5) * 0.8;
        b.vx      = -Math.cos(angle) * LAUNCH_SPEED;
        b.vy      = -Math.sin(angle) * LAUNCH_SPEED;
        b.launched  = true;
        b.snapTimer = 0;
        break; // only launch the one that was clicked
      }
    }
  }, []);

  // ── Resize ───────────────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const section = canvas.closest('section') as HTMLElement | null;
    const host    = section ?? canvas.parentElement;
    if (!host) return;
    const w = host.clientWidth  || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    canvas.width  = w;
    canvas.height = h;
    sizeRef.current = { w, h };

    // Recompute home positions for new size and reposition bubbles
    const homes = computeHomePositions(techs.length, BUBBLE_RADIUS, w, h);
    bubblesRef.current.forEach((b, i) => {
      b.hx = homes[i].hx;
      b.hy = homes[i].hy;
      if (!b.launched) {
        b.x = b.hx;
        b.y = b.hy;
      }
    });
  }, [techs.length]);

  // ── Mount ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    const { w, h } = sizeRef.current;
    initBubbles(w, h);

    // Pause animation when off-screen
    const visObs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: '80px' }
    );
    visObs.observe(canvas);

    // Resize observer
    const section      = canvas.closest('section') as HTMLElement | null;
    const resizeTarget = section ?? canvas.parentElement;
    const resizeObs    = new ResizeObserver(handleResize);
    if (resizeTarget) resizeObs.observe(resizeTarget);

    // Click handler
    canvas.addEventListener('pointerdown', handlePointerDown);

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      visObs.disconnect();
      resizeObs.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handleResize, handlePointerDown, initBubbles, step]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
    />
  );
}
