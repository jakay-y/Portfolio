import { useInView } from "motion/react";
import { Children, cloneElement, isValidElement, useRef, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/hooks/use-intro-done";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
}

/** Wraps StaggerItem children, handing each one its index so they cascade in. */
export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) =>
        isValidElement(child) ? cloneElement(child as ReactElement<{ index?: number }>, { index: i }) : child,
      )}
    </div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function StaggerItem({ children, className, index = 0 }: StaggerItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const introDone = useIntroDone();
  const shown = inView && introDone;

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-small ease-premium motion-reduce:transition-none", className)}
      style={{
        transitionDelay: `${index * 0.08}s`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}
