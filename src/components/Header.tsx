import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useWorkInView } from "@/hooks/use-work-in-view";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const workInView = useWorkInView();

  function isActive(href: string) {
    if (href === "/#work") return pathname.startsWith("/work/") || (pathname === "/" && workInView);
    return pathname === href;
  }

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
        <div className="flex w-full max-w-3xl items-center justify-between gap-6 rounded-pill border border-border bg-card px-5 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_12px_32px_-16px_rgba(0,0,0,0.18)]">
          <Link
            to="/"
            aria-label={`${site.name} — home`}
            className="rounded-sm font-heading text-sm font-semibold tracking-tight outline-offset-4 transition-opacity duration-small hover:opacity-70"
          >
            {site.short}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <MagneticLink
                key={item.href}
                to={item.href}
                active={isActive(item.href)}
                className={cn(
                  "inline-block rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-small hover:text-foreground",
                  isActive(item.href) && "bg-foreground/5 text-foreground",
                )}
              >
                {item.label}
              </MagneticLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs text-muted-foreground">{site.availability}</span>
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative h-8 w-8 rounded-full transition-opacity duration-small hover:opacity-60 md:hidden"
          >
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-foreground transition-transform duration-small ease-smooth",
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-foreground transition-transform duration-small ease-smooth",
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background/95 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.normal }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth, delay: 0.08 * i }}
              >
                <NavLink
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm font-heading text-4xl font-semibold tracking-tight transition-opacity duration-small hover:opacity-60"
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              {site.availability}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
