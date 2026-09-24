import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode, type Ref } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  icon?: boolean;
  className?: string;
}

export function Button({ children, href, external, onClick, variant = "primary", icon = true, className }: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const pull = useMagnetic(ref, 10);
  const pullStyle = { transform: `translate(${pull.x}px, ${pull.y}px)` };

  const base = cn(
    "group inline-flex items-center gap-3 rounded-pill py-2 pl-6 pr-2 text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 ease-smooth hover:scale-[1.02] active:scale-[0.97]",
    variant === "primary" && "bg-primary text-primary-foreground",
    variant === "ghost" && "border border-border bg-transparent text-foreground hover:border-foreground",
    !icon && "pr-6",
    className,
  );

  const content = (
    <span className={base}>
      <span>{children}</span>
      {icon && (
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105",
            variant === "primary" ? "bg-white/15" : "bg-foreground/5",
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      )}
    </span>
  );

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a
          ref={ref as unknown as Ref<HTMLAnchorElement>}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          style={pullStyle}
        >
          {content}
        </a>
      );
    }
    return (
      <Link ref={ref as unknown as Ref<HTMLAnchorElement>} to={href} style={pullStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref as unknown as Ref<HTMLButtonElement>} onClick={onClick} style={pullStyle}>
      {content}
    </button>
  );
}
