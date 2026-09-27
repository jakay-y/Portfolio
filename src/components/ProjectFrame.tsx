import { motion, type MotionValue } from "motion/react";
import type { Project } from "@/data/projects";
import { ParallaxPan } from "@/components/motion/ParallaxPan";
import { BrowserFrame } from "@/components/BrowserFrame";
import { cn } from "@/lib/utils";

interface ProjectFrameProps {
  project: Project;
  /** Horizontal parallax offset (e.g. "-4%") applied to a plain image inside its frame. */
  shift?: MotionValue<string>;
  /** Frame height ÷ width, for panning tall images (defaults to the carousel's 4:3). */
  containerAspect?: number;
  /** Load immediately (above-the-fold use, e.g. the case-study hero). */
  eager?: boolean;
}

/** Renders a project's showcase visual: a browser-framed shot, a panning tall image, or a plain image. */
export function ProjectFrame({ project, shift, containerAspect = 3 / 4, eager = false }: ProjectFrameProps) {
  const alt = project.gallery[0]?.alt ?? project.title;

  if (project.deckImage && project.deckFramed) {
    return (
      <BrowserFrame
        src={project.deckImage}
        alt={alt}
        url={project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      />
    );
  }

  if (project.parallax) {
    // ParallaxPan already provides its own motion — no extra shift layered on top.
    return (
      <ParallaxPan
        src={project.parallax.src}
        alt={alt}
        imageAspect={project.parallax.imageAspect}
        containerAspect={containerAspect}
      />
    );
  }

  const fit = project.deckFit === "contain" ? "object-contain" : "object-cover object-top";
  // The frame box sets the size (aspect-ratio), so lazy loading never shifts layout.
  const img = (
    <img
      src={project.deckImage ?? project.image}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full", fit)}
    />
  );

  if (!shift) return img;

  // Oversized box so the parallax shift never exposes empty edges.
  return (
    <motion.div className="absolute inset-y-0 -inset-x-[8%]" style={{ x: shift }}>
      {img}
    </motion.div>
  );
}
