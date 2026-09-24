import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  as?: "div" | "section";
}

/**
 * Scroll reveal — uses Motion's `useInView` (a plain IntersectionObserver hook,
 * not its tween engine) to flip a boolean, then a CSS transition does the actual
 * animating. Reliable regardless of any Motion `animate`/`whileInView` quirks.
 */
export function Reveal({ children, delay = 0, y = 24, blur = false, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Component = as;

  return (
    <Component
      ref={ref}
      className={cn("transition-all duration-700 ease-smooth motion-reduce:transition-none", className)}
      style={{
        transitionDelay: `${delay}s`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        filter: blur ? (inView ? "blur(0px)" : "blur(8px)") : undefined,
      }}
    >
      {children}
    </Component>
  );
}
