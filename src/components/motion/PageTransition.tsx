import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { motionTokens } from "@/lib/motion-tokens";

const variants = {
  initial: { opacity: 0, y: motionTokens.distance.sm },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -motionTokens.distance.sm },
};

/**
 * Wraps a <Routes location={displayLocation} key={displayLocation.pathname}> tree.
 * The key must live on Routes itself (not just this wrapper) so React Router
 * keeps rendering the outgoing route while it plays its exit animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{
          duration: motionTokens.duration.normal,
          ease: motionTokens.easing.smooth,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
