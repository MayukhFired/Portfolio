 'use client';

 import { useEffect, useRef } from 'react';
 import './ShapeGrid.css';

 type Direction = 'horizontal' | 'vertical' | 'diagonal';
 type Shape = 'square' | 'hexagon' | 'circle';

 interface ShapeGridProps {
   direction?: Direction;
   speed?: number;
   borderColor?: string;
   squareSize?: number;
   hoverFillColor?: string;
   shape?: Shape;
   hoverTrailAmount?: number;
   className?: string;
 }

 interface TrailPoint {
   x: number;
   y: number;
   t: number;
 }

 const ShapeGrid = ({
   direction = 'diagonal',
   speed = 0.5,
   borderColor = 'rgba(56, 189, 248, 0.35)', // cyan-400 with opacity
   squareSize = 40,
   hoverFillColor = '#020617', // slate-950
   shape = 'hexagon',
   hoverTrailAmount = 0.55,
   className,
 }: ShapeGridProps) => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);
   const rafRef = useRef<number>(0);
   const visibleRef = useRef<boolean>(true);
   const activeRef = useRef<boolean>(true);
   const trailRef = useRef<TrailPoint[]>([]);

   useEffect(() => {
     const container = containerRef.current;
     if (!container) return;

     const observer = new IntersectionObserver(
       ([entry]) => {
         visibleRef.current = entry.isIntersecting;
       },
       { rootMargin: '80px' }
     );

     observer.observe(container);
     return () => observer.disconnect();
   }, []);

   useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     const isTouch = window.matchMedia('(pointer: coarse)').matches;

     const maxDpr = reduceMotion ? 1 : 1.5;
     const effectiveHoverTrail =
       reduceMotion || isTouch ? 0 : Math.max(0, Math.min(1, hoverTrailAmount));
     const effectiveSpeed = reduceMotion ? Math.min(speed, 0.15) : speed;

     const resize = () => {
       const rect = canvas.getBoundingClientRect();
       const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
       const width = rect.width || window.innerWidth;
       const height = rect.height || window.innerHeight;
       canvas.width = Math.floor(width * dpr);
       canvas.height = Math.floor(height * dpr);
       canvas.style.width = `${width}px`;
       canvas.style.height = `${height}px`;
       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
     };

     resize();
     window.addEventListener('resize', resize);

     const handleMouseMove = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       const x = e.clientX - rect.left;
       const y = e.clientY - rect.top;
       const now = performance.now();
       trailRef.current.push({ x, y, t: now });
     };

     if (effectiveHoverTrail > 0) {
       window.addEventListener('mousemove', handleMouseMove, { passive: true });
     }

     const handleVisibility = () => {
       activeRef.current = !document.hidden;
     };
     document.addEventListener('visibilitychange', handleVisibility);

     let lastTime = performance.now();
     const baseStep = squareSize;

     const dirVec =
       direction === 'horizontal'
         ? { dx: 1, dy: 0 }
         : direction === 'vertical'
           ? { dx: 0, dy: 1 }
           : { dx: 1, dy: 1 };

     const drawShape = (x: number, y: number, size: number) => {
       const half = size / 2;
       if (shape === 'circle') {
         ctx.beginPath();
         ctx.arc(x + half, y + half, half * 0.8, 0, Math.PI * 2);
         ctx.stroke();
         return;
       }

       if (shape === 'hexagon') {
         const r = half * 0.95;
         const cx = x + half;
         const cy = y + half;
         ctx.beginPath();
         for (let i = 0; i < 6; i++) {
           const a = (Math.PI / 3) * i;
           const px = cx + r * Math.cos(a);
           const py = cy + r * Math.sin(a);
           if (i === 0) ctx.moveTo(px, py);
           else ctx.lineTo(px, py);
         }
         ctx.closePath();
         ctx.stroke();
         return;
       }

       // square (default)
       ctx.strokeRect(x, y, size, size);
     };

     const animate = (time: number) => {
       rafRef.current = requestAnimationFrame(animate);
       if (!visibleRef.current || !activeRef.current) return;

       const deltaMs = time - lastTime;
       if (deltaMs < 1000 / (reduceMotion ? 20 : 30)) return;
       lastTime = time;

       const width = canvas.clientWidth || window.innerWidth;
       const height = canvas.clientHeight || window.innerHeight;

       ctx.clearRect(0, 0, width, height);

       const offset = ((time * effectiveSpeed) / 6000) * baseStep;

       ctx.lineWidth = 0.7;
       ctx.strokeStyle = borderColor;

       const now = performance.now();
       const trails = trailRef.current.filter((p) => now - p.t < 900);
       trailRef.current = trails;

       for (let y = -baseStep; y < height + baseStep; y += baseStep) {
         for (let x = -baseStep; x < width + baseStep; x += baseStep) {
           const tx = x + dirVec.dx * offset;
           const ty = y + dirVec.dy * offset;

           let alphaBoost = 0;
           if (effectiveHoverTrail > 0 && trails.length > 0) {
             for (let i = trails.length - 1; i >= 0; i--) {
               const p = trails[i];
               const dx = tx + baseStep / 2 - p.x;
               const dy = ty + baseStep / 2 - p.y;
               const distSq = dx * dx + dy * dy;
               const maxR = baseStep * 2;
               if (distSq < maxR * maxR) {
                 const d = Math.sqrt(distSq);
                 const tNorm = 1 - (now - p.t) / 900;
                 alphaBoost = Math.max(
                   alphaBoost,
                   effectiveHoverTrail * tNorm * (1 - d / maxR)
                 );
               }
             }
           }

           if (alphaBoost > 0.02) {
             ctx.save();
             ctx.fillStyle = hoverFillColor;
             ctx.globalAlpha = 0.4 * alphaBoost;
             ctx.fillRect(tx, ty, baseStep, baseStep);
             ctx.restore();
           }

           ctx.save();
           ctx.globalAlpha = 0.35 + alphaBoost * 0.4;
           drawShape(tx, ty, baseStep * 0.85);
           ctx.restore();
         }
       }
     };

     rafRef.current = requestAnimationFrame(animate);

     return () => {
       cancelAnimationFrame(rafRef.current);
       window.removeEventListener('resize', resize);
       if (effectiveHoverTrail > 0) {
         window.removeEventListener('mousemove', handleMouseMove);
       }
       document.removeEventListener('visibilitychange', handleVisibility);
     };
   }, [direction, speed, borderColor, squareSize, hoverFillColor, shape, hoverTrailAmount]);

   return (
     <div ref={containerRef} className={`shapegrid-container ${className ?? ''}`}>
       <canvas ref={canvasRef} className="shapegrid-canvas" />
     </div>
   );
 };

 export default ShapeGrid;

