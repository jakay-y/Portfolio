import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { useLayoutEffect, type ReactNode } from "react";
import { motionTokens } from "@/lib/motion-tokens";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { isInstantRouteSwap } from "@/lib/view-transition";

const variants = {
  initial: { opacity: 0, y: motionTokens.distance.sm },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -motionTokens.distance.sm },
};

/**
 * Wraps a <Routes location={displayLocation} key={displayLocation.pathname}> tree.
 * The key must live on Routes itself (not just this wrapper) so React Router
 * keeps rendering the outgoing route while it plays its exit animation.
 * During a View Transition the browser animates the swap, so this fade steps aside.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  // During a View Transition the new page must mount in the same commit (AnimatePresence
  // would wait on rAF, which the browser pauses mid-transition), so render it directly.
  if (isInstantRouteSwap()) {
    return (
      <div key={location.pathname}>
        <ScrollReset hash={location.hash} />
        {children}
      </div>
    );
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: motionTokens.duration.medium, ease: motionTokens.easing.premium }}
      >
        <ScrollReset hash={location.hash} />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Each new page starts at the top — unless it was opened on an in-page anchor like /#work. */
function ScrollReset({ hash }: { hash: string }) {
  useLayoutEffect(() => {
    if (!hash) smoothScrollTo(0, { immediate: true });
    // Mount-only: the wrapper is keyed by pathname, so this runs once per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
