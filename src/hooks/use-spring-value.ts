import { useEffect, useRef, useState } from "react";

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/**
 * A tiny rAF-driven damped-spring toward a 2D target. Motion's own `useSpring`
 * doesn't actually animate in this environment (confirmed via diagnostics —
 * its internal driver produces zero live animations), so this reimplements
 * real spring physics by hand: guaranteed to run, since it's plain
 * requestAnimationFrame + React state, nothing Motion-internal involved.
 */
export function useSpringValue(targetX: number, targetY: number, config: SpringConfig = {}) {
  const { stiffness = 200, damping = 22, mass = 1 } = config;
  const [pos, setPos] = useState({ x: targetX, y: targetY });
  const state = useRef({ x: targetX, y: targetY, vx: 0, vy: 0 });
  const target = useRef({ x: targetX, y: targetY });
  const frame = useRef<number | null>(null);
  const configRef = useRef({ stiffness, damping, mass });

  target.current = { x: targetX, y: targetY };
  configRef.current = { stiffness, damping, mass };

  function tick() {
    const s = state.current;
    const t = target.current;
    const { stiffness, damping, mass } = configRef.current;
    const dt = 1 / 60;

    const fx = -stiffness * (s.x - t.x) - damping * s.vx;
    const fy = -stiffness * (s.y - t.y) - damping * s.vy;
    s.vx += (fx / mass) * dt;
    s.vy += (fy / mass) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    setPos({ x: s.x, y: s.y });

    const settled = Math.abs(s.x - t.x) < 0.05 && Math.abs(s.y - t.y) < 0.05 && Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05;
    if (!settled) {
      frame.current = requestAnimationFrame(tick);
    } else {
      s.x = t.x;
      s.y = t.y;
      frame.current = null;
    }
  }

  // The loop stops itself once settled. If the target moves again after that
  // (e.g. the mouse keeps moving), restart it here — checked on every render
  // rather than only on mount, since a stopped loop can't check anything itself.
  if (frame.current === null) {
    const s = state.current;
    if (Math.abs(s.x - targetX) > 0.05 || Math.abs(s.y - targetY) > 0.05) {
      frame.current = requestAnimationFrame(tick);
    }
  }

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, []);

  return pos;
}
