import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollEnterProps {
  children: ReactNode;
  className?: string;
}

/** Fades, lifts, and scales a section in as it scrolls into place — driven by
 * scroll position (useScroll/useTransform) rather than whileInView, so it
 * reads as a continuation of whatever's pinned above it rather than a cut. */
export function ScrollEnter({ children, className }: ScrollEnterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  );
}
