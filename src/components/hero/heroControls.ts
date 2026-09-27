/** Share of the anchor box the object's width fills — matches the framing of /hero-poster.webp. */
export const OBJECT_FILL = 0.78;
/** How far each half travels per unit of `separation`, in object half-widths. */
export const SEPARATION_GAP = 1.1;
/** Hinge angle (radians) per unit of `separation`, capped so halves only open ~13°. */
export const HINGE_PER_SEPARATION = 0.22;

/**
 * Mutable control block for the hero object. Scroll/stage code writes targets here;
 * the render loop damps toward them every frame, so updates never trigger React renders.
 */
export interface HeroControls {
  /** Split boundary in object space (-1 all build … +1 all design) used when the cursor isn't driving it. */
  split: number;
  /** 0 = one closed form; each unit pulls the halves apart by SEPARATION_GAP half-widths. */
  separation: number;
  /** 0 = normal design/build split, 1 = the entire object is solid pearl. */
  solidity: number;
  opacity: number;
  /** Multiplier on the size given by the layout anchor. */
  scale: number;
  /** Extra rotation in radians, added on top of cursor tilt. */
  rotateX: number;
  rotateY: number;
  /** 0 = vertical boundary (halves part left/right), 1 = horizontal boundary (design up, build down). */
  axis: number;
  /** 0–1: how strongly the cursor (or the touch idle loop) drives split, tilt and surface response. */
  cursor: number;
}

export interface HeroPointer {
  /** Pointer position over the hero, normalised to -1…1 (y up). */
  x: number;
  y: number;
  inside: boolean;
}

export function createHeroControls(overrides: Partial<HeroControls> = {}): HeroControls {
  return {
    split: 0.12,
    separation: 0,
    solidity: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    axis: 0,
    cursor: 1,
    ...overrides,
  };
}

export function createHeroPointer(): HeroPointer {
  return { x: 0, y: 0, inside: false };
}
