import { useEffect, useSyncExternalStore } from "react";

let workInView = false;
const listeners = new Set<() => void>();

function setWorkInView(next: boolean) {
  if (next === workInView) return;
  workInView = next;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/** Whether the Home work section currently fills a meaningful part of the viewport. */
export function useWorkInView() {
  return useSyncExternalStore(subscribe, () => workInView, () => false);
}

/** Reports the work section's visibility so the nav can mark "Work" active. */
export function useTrackWorkInView(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Active while the section crosses the middle band of the viewport.
    const observer = new IntersectionObserver(([entry]) => setWorkInView(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setWorkInView(false);
    };
  }, [ref]);
}
