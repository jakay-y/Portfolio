/** The site's single motion voice. Every non-scrubbed animation draws from these. */
export const motionTokens = {
  duration: {
    small: 0.4,
    medium: 0.7,
    large: 1.1,
    instant: 0.08,
    // Legacy names, aliased onto the three-step scale above.
    fast: 0.4,
    normal: 0.7,
    slow: 0.7,
    crawl: 1.1,
  },
  easing: {
    premium: [0.22, 1, 0.36, 1] as [number, number, number, number],
    // Legacy names, aliased onto the premium curve.
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    sharp: [0.22, 1, 0.36, 1] as [number, number, number, number],
    bounce: [0.34, 1.56, 0.64, 1],
    linear: [0, 0, 1, 1],
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
  },
  scale: {
    subtle: 0.98,
    press: 0.95,
    pop: 1.04,
  },
} as const;

export const springs = {
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  instant: { type: "spring", stiffness: 600, damping: 35 },
  release: { type: "spring", stiffness: 200, damping: 20, restDelta: 0.001 },
} as const;
