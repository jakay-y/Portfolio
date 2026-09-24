import { motionConfig } from "@/lib/motion-config";

interface ParallaxPanProps {
  src: string;
  alt: string;
  /** naturalHeight / naturalWidth of the source image */
  imageAspect: number;
  /** height / width of the visible window it sits in */
  containerAspect: number;
  duration?: number;
}

/**
 * Slowly pans a taller-than-the-window screenshot up and back down in a loop —
 * a live, moving preview without shipping a video file.
 *
 * Plain CSS animation (not motion/react): this is a simple infinite two-point
 * loop with no scroll/gesture/viewport wiring, so CSS keyframes + `alternate`
 * direction is the more reliable and cheaper tool for the job — it also means
 * `prefers-reduced-motion` is handled for free by the global rule in index.css.
 */
export function ParallaxPan({ src, alt, imageAspect, containerAspect, duration = 18 }: ParallaxPanProps) {
  const scrollPercent = Math.max(0, 1 - containerAspect / imageAspect) * 100;
  const disabled = !motionConfig.shouldAnimate() || scrollPercent === 0;

  if (disabled) {
    return <img src={src} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full animate-parallax-pan"
      style={{
        // @ts-expect-error -- CSS custom properties aren't in the style typings
        "--pan-y": `-${scrollPercent}%`,
        "--pan-duration": `${duration}s`,
      }}
    />
  );
}
