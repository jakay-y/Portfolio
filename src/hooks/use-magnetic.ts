import { useEffect, useRef, useState, type RefObject } from "react";
import { useSpringValue } from "@/hooks/use-spring-value";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Pulls an element a few px toward the cursor when it's nearby, spring-released when it isn't. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, maxPull = 8) {
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const rafPending = useRef(false);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const radius = Math.max(rect.width, rect.height) * 1.4 + 40;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const pull = 1 - dist / radius;
          setTarget({ x: clamp(dx * 0.35 * pull, -maxPull, maxPull), y: clamp(dy * 0.35 * pull, -maxPull, maxPull) });
        } else {
          setTarget({ x: 0, y: 0 });
        }
      });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [ref, maxPull]);

  return useSpringValue(target.x, target.y, { stiffness: 250, damping: 16 });
}
