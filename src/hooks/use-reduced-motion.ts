import { useReducedMotion as useMotionReducedMotion } from "motion/react";

export function useSafeMotion(fullY: number = 16) {
  const reduce = useMotionReducedMotion();
  return {
    initial: { opacity: 0, y: reduce ? 0 : fullY },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -fullY },
  };
}
