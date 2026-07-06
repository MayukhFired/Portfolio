'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const updatePos = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    const handleHoverStart = () => setHovering(true);
    const handleHoverEnd = () => setHovering(false);

    window.addEventListener('mousemove', updatePos);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Detect hoverable elements
    const interactables = document.querySelectorAll('button, a, [role="button"]');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', updatePos);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  // Trail effect
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    let rafId: number;
    let trailX = trail.x;
    let trailY = trail.y;

    const animate = () => {
      trailX = lerp(trailX, pos.x, 0.12);
      trailY = lerp(trailY, pos.y, 0.12);
      setTrail({ x: trailX, y: trailY });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  // Only show on non-touch devices
  const [isTouch, setIsTouch] = useState(true);
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Main dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: 8,
          height: 8,
          background: '#00f5ff',
          boxShadow: '0 0 10px rgba(0,245,255,0.8)',
          transform: clicking ? 'scale(0.5)' : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      />

      {/* Trail ring */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full border border-cyan-400/50"
        style={{
          left: trail.x - 16,
          top: trail.y - 16,
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          marginLeft: hovering ? -8 : 0,
          marginTop: hovering ? -8 : 0,
          opacity: 0.6,
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease',
          boxShadow: hovering ? '0 0 15px rgba(123,47,255,0.5)' : 'none',
          borderColor: hovering ? 'rgba(123, 47, 255, 0.6)' : 'rgba(0, 245, 255, 0.4)',
        }}
      />
    </>
  );
}
