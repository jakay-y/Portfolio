import Lenis from "lenis";
import { motionTokens } from "@/lib/motion-tokens";

let lenis: Lenis | null = null;
let paused = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Starts site-wide smooth scrolling (skipped under reduced motion). Returns a cleanup. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
  if (paused) lenis.stop();
  let frame = requestAnimationFrame(function raf(time) {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  });
  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

/** Freezes wheel/touch scrolling (e.g. while the loading screen is up). */
export function pauseSmoothScroll(pause: boolean) {
  paused = pause;
  if (pause) lenis?.stop();
  else lenis?.start();
}

/** Smooth-scrolls to an element or absolute y position, through Lenis when it's running. */
export function smoothScrollTo(target: HTMLElement | number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: motionTokens.duration.crawl * 1.4, easing: easeOutExpo });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
