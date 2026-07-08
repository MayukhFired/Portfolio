'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  const clickingRef = useRef(false);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');

    const syncEnabled = () => {
      setEnabled(pointerQuery.matches && motionQuery.matches);
    };

    syncEnabled();
    pointerQuery.addEventListener('change', syncEnabled);
    motionQuery.addEventListener('change', syncEnabled);

    return () => {
      pointerQuery.removeEventListener('change', syncEnabled);
      motionQuery.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const updatePos = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target;
      hoveringRef.current = target instanceof Element
        ? !!target.closest('button, a, [role="button"], input, textarea, select, label, [data-cursor-hover]')
        : false;
      if (!visibleRef.current) {
        visibleRef.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '0.6';
      }
    };

    const handleMouseDown = () => {
      clickingRef.current = true;
    };

    const handleMouseUp = () => {
      clickingRef.current = false;
    };

    const hideCursor = () => {
      visibleRef.current = false;
      hoveringRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleVisibilityChange = () => {
      if (document.hidden) hideCursor();
    };

    window.addEventListener('mousemove', updatePos, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    let rafId: number;

    const animate = () => {
      const pos = posRef.current;
      trailRef.current = {
        x: lerp(trailRef.current.x, pos.x, 0.12),
        y: lerp(trailRef.current.y, pos.y, 0.12),
      };

      const dotScale = clickingRef.current ? 0.5 : 1;
      const ringScale = hoveringRef.current ? 1.5 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${dotScale})`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailRef.current.x - 16}px, ${trailRef.current.y - 16}px, 0) scale(${ringScale})`;
        ringRef.current.style.boxShadow = hoveringRef.current ? '0 0 15px rgba(123,47,255,0.5)' : 'none';
        ringRef.current.style.borderColor = hoveringRef.current
          ? 'rgba(123, 47, 255, 0.6)'
          : 'rgba(0, 245, 255, 0.4)';
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', updatePos);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          background: '#00f5ff',
          boxShadow: '0 0 10px rgba(0,245,255,0.8)',
          willChange: 'transform, opacity',
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] rounded-full border border-cyan-400/50"
        style={{
          width: 32,
          height: 32,
          opacity: 0.6,
          willChange: 'transform, opacity',
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
        }}
      />
    </>
  );
}
