import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { ProcessStep } from "@/data/process";
import { cn } from "@/lib/utils";

interface ProcessSectionProps {
  steps: ProcessStep[];
}

/** Sticky left counter + a right-hand step list with a scroll-filled vertical
 * line. The line's fill is scroll-linked (useScroll/useTransform — reliable
 * here); the active-step counter is tracked by hand off the same container's
 * geometry, since it needs a plain number for text, not just a CSS transform. */
export function ProcessSection({ steps }: ProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [steps.length]);

  return (
    <section ref={containerRef} className="border-t border-border px-6 py-section md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">How I Work</span>
            <h2 className="mt-3 max-w-xs font-heading text-heading-lg font-semibold tracking-tight">
              A process built for clarity, not surprises.
            </h2>

            <div className="mt-3xl hidden md:block" aria-hidden="true">
              <p className="font-mono text-sm text-faint">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">{steps[active].title}</p>
            </div>
          </div>
        </div>

        <div className="relative md:col-span-8">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:block">
            <motion.div
              className="w-px origin-top bg-foreground"
              style={{ scaleY: lineScale, height: "100%" }}
            />
          </div>

          <ol className="space-y-3xl md:space-y-0 md:pl-12">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={cn(
                  "md:flex md:min-h-[55vh] md:flex-col md:justify-center",
                  "transition-opacity duration-500 motion-reduce:transition-none",
                  i === active ? "md:opacity-100" : "md:opacity-40",
                )}
              >
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-heading text-heading-md font-semibold tracking-tight">{step.title}</h3>
                  <span className="text-sm text-muted-foreground">{step.duration}</span>
                </div>
                <p className="mt-3 max-w-lg text-muted-foreground">{step.description}</p>
                <p className="mt-3 text-sm">
                  <span className="text-faint">You get: </span>
                  <span className="text-foreground">{step.deliverable}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
