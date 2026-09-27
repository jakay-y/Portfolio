import { flushSync } from "react-dom";

/** Shared view-transition-name for a project's showcase frame (carousel card ↔ case-study hero). */
export function projectTransitionName(slug: string) {
  return `project-${slug}`;
}

// While a view transition swaps routes, PageTransition skips its own fade so the snapshot is clean.
let instantRouteSwap = false;
export function isInstantRouteSwap() {
  return instantRouteSwap;
}

// The carousel reopens on the project the visitor last opened.
let lastProjectSlug: string | null = null;
export function getLastProjectSlug() {
  return lastProjectSlug;
}
export function setLastProjectSlug(slug: string) {
  lastProjectSlug = slug;
}

// Rendering is paused while a view transition updates the DOM, so requestAnimationFrame
// never fires in here — poll with timers instead.
function waitForElement(selector: string, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    (function check() {
      if (document.querySelector(selector) || performance.now() - start > timeoutMs) resolve();
      else setTimeout(check, 16);
    })();
  });
}

/**
 * Navigates inside a View Transition so the element named `name` morphs between pages.
 * Falls back to a plain navigation where the API (or motion) isn't available.
 */
export function navigateWithTransition(navigate: () => void, name: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("startViewTransition" in document) || reduced) {
    navigate();
    return;
  }
  instantRouteSwap = true;
  const transition = document.startViewTransition(async () => {
    flushSync(navigate);
    // The new page's frame must exist before the "after" snapshot is taken.
    await waitForElement(`[data-vt="${name}"]`, 1200);
    // Let passive effects (scroll resets, in-page jumps) run before the "after" snapshot.
    await new Promise((r) => setTimeout(r, 32));
  });
  transition.finished.finally(() => {
    instantRouteSwap = false;
  });
}
