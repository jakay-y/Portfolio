import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface MagneticLinkProps {
  to: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}

/** A nav link that pulls a few px toward the cursor, with an underline that grows from the left on hover. */
export function MagneticLink({ to, active, className, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pull = useMagnetic(ref, 6);

  return (
    <Link
      ref={ref}
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn("group relative", className)}
      style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-4 bottom-1 h-px origin-left bg-current transition-transform duration-small ease-smooth",
          active ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
        )}
      />
    </Link>
  );
}
