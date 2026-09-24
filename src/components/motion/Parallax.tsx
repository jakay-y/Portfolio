import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { motionConfig } from "@/lib/motion-config";

interface ParallaxProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Scroll-linked parallax — moves children slower/faster than scroll as the section crosses the viewport. */
export function Parallax({ children, strength = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  if (!motionConfig.shouldAnimate()) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
