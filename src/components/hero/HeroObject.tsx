import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { HERO_POSTER_SRC } from "./useHero";
import { motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import type { HeroControls, HeroPointer } from "./heroControls";

// three.js + R3F live in their own chunk; nothing 3D blocks first paint.
const HeroScene = lazy(() => import("./HeroScene"));

interface HeroCanvasLayerProps {
  controls: RefObject<HeroControls>;
  pointer: RefObject<HeroPointer>;
  anchor: RefObject<HTMLElement | null>;
  touch: boolean;
  onReady: () => void;
  className?: string;
}

/** Full-bleed canvas layer. Renders only while on screen and while the tab is visible. */
export function HeroCanvasLayer({ controls, pointer, anchor, touch, onReady, className }: HeroCanvasLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === "visible");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 transition-opacity duration-medium ease-premium", className)}
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Suspense fallback={null}>
        <HeroScene
          controls={controls}
          pointer={pointer}
          anchor={anchor}
          touch={touch}
          active={inView && tabVisible}
          onReady={() => {
            setReady(true);
            onReady();
          }}
        />
      </Suspense>
    </div>
  );
}

interface HeroPosterProps {
  /** Poster stays visible until the live scene has rendered, then crossfades out. */
  hidden: boolean;
  /** Stage-driven widening of the contact shadow (0 = resting, 1 = halves fully apart). */
  spread?: MotionValue<number>;
  shadowOpacity?: MotionValue<number>;
  className?: string;
}

/** The static poster plus the soft contact shadow shared by poster and live scene. */
export function HeroPoster({ hidden, spread, shadowOpacity, className }: HeroPosterProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.div
        aria-hidden
        className="absolute bottom-[4%] left-[19%] h-[9%] w-[62%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,45,30,0.28),rgba(60,45,30,0.12)_55%,transparent)] blur-md"
        style={{ scaleX: spread, opacity: shadowOpacity }}
      />
      <img
        src={HERO_POSTER_SRC}
        alt=""
        width={900}
        height={900}
        decoding="async"
        // React 18 only forwards the lowercase attribute.
        {...{ fetchpriority: "high" }}
        className="relative h-full w-full select-none object-contain transition-opacity duration-medium ease-premium"
        style={{ opacity: hidden ? 0 : 1 }}
        draggable={false}
      />
    </div>
  );
}
