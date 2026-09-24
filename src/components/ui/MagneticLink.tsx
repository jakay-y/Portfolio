import { useRef, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useMagnetic } from "@/hooks/use-magnetic";

interface MagneticLinkProps {
  to: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children: ReactNode;
}

/** A NavLink that pulls a few px toward the cursor when it's nearby. */
export function MagneticLink({ to, end, className, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pull = useMagnetic(ref, 6);

  return (
    <NavLink
      ref={ref}
      to={to}
      end={end}
      className={className}
      style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
    >
      {children}
    </NavLink>
  );
}
