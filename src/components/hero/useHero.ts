import { useEffect, useRef, useState, type RefObject } from "react";
import { createHeroPointer, type HeroPointer } from "./heroControls";

export const HERO_POSTER_SRC = "/hero-poster.webp";

/** The three.js scene chunk. Calling this early (during the loader) downloads and parses it
 *  while the main thread is otherwise idle; React.lazy reuses the same promise later. */
let sceneModule: Promise<typeof import("./HeroScene")> | null = null;
export function loadHeroScene() {
  sceneModule ??= import("./HeroScene");
  return sceneModule;
}

/** True only for hardware-accelerated WebGL — software rasterisers (no GPU) get the poster. */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export type HeroMode = "webgl" | "poster";

/** Decides once whether the live scene runs, or the static poster stands in for it. */
export function useHeroSupport(): { mode: HeroMode; touch: boolean } {
  const [support] = useState(() => {
    if (typeof window === "undefined") return { mode: "poster" as HeroMode, touch: false };
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = touch && (navigator.hardwareConcurrency ?? 8) <= 4;
    const mode: HeroMode = reduced || lowEnd || !supportsWebGL() ? "poster" : "webgl";
    return { mode, touch };
  });
  return support;
}

/** Tracks the pointer over `target`, normalised to -1…1, without re-rendering. */
export function useHeroPointer(target: RefObject<HTMLElement | null>) {
  const pointer = useRef<HeroPointer>(createHeroPointer());
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !el) return;
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.inside = true;
    }
    function onLeave() {
      pointer.current.inside = false;
    }
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [target]);
  return pointer;
}
