import { CapabilityGlyph } from "@/components/CapabilityGlyph";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

export interface BentoTile {
  title: string;
  items: string[];
  /** "wide" = 2 cols, "full" = 3 cols, "normal" (default) = 1 col, in a 3-col grid. */
  span?: "wide" | "normal" | "full";
  glyphType?: number;
  /** Renders items as small pill chips instead of a list — for a stack/tools-style tile. */
  chips?: boolean;
}

interface CapabilitiesBentoProps {
  tiles: BentoTile[];
  className?: string;
}

/** The asymmetric bento grid — same card styling, radius, hover and stagger-in
 * motion everywhere it's used (landing page Capabilities, About's What I do). */
export function CapabilitiesBento({ tiles, className }: CapabilitiesBentoProps) {
  return (
    <StaggerGroup className={cn("grid gap-5 md:grid-cols-3", className)}>
      {tiles.map((tile, i) => (
        <StaggerItem
          key={tile.title}
          className={cn(
            "group relative overflow-hidden rounded-[2rem] border border-border bg-card/70 p-8 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 ease-smooth hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_30px_60px_-28px_rgba(0,0,0,0.28)]",
            tile.span === "wide" && "md:col-span-2",
            tile.span === "full" && "md:col-span-3",
          )}
        >
          <CapabilityGlyph
            type={tile.glyphType ?? i}
            className="text-muted-foreground transition-colors duration-500 ease-smooth group-hover:text-accent"
          />
          <span className="relative mt-6 block text-xs text-faint">0{i + 1}</span>
          <h3 className="relative mt-2 font-heading text-heading-md font-semibold tracking-tight">{tile.title}</h3>
          {tile.chips ? (
            <div className="relative mt-4 flex flex-wrap gap-2">
              {tile.items.map((item) => (
                <span key={item} className="rounded-pill border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <ul className={cn("relative mt-4 space-y-2.5", tile.span !== "normal" && "md:columns-2 md:gap-x-10")}>
              {tile.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
