import { useSyncExternalStore } from "react";

// The loading screen plays on every full page load, so entrance animations start held.
let introDone = false;
const listeners = new Set<() => void>();

/** Called by LoadingScreen as its curtain lifts — releases the page's entrance animations. */
export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/** True once the loading screen is out of the way; entrance animations should wait for it. */
export function useIntroDone() {
  return useSyncExternalStore(subscribe, () => introDone, () => true);
}
