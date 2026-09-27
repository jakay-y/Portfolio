import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/hooks/use-intro-done";

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
export function Reveal({ children, delay = 0, y = 16, blur = false, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Fires once, when ~15% of the element has entered the viewport.
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const introDone = useIntroDone();
  const shown = inView && introDone;
  const Component = as;

  return (
    <Component
      ref={ref}
      className={cn("transition-all duration-medium ease-premium motion-reduce:transition-none", className)}
      style={{
        transitionDelay: `${delay}s`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        filter: blur ? (shown ? "blur(0px)" : "blur(8px)") : undefined,
      }}
    >
      {children}
    </Component>
  );
}
