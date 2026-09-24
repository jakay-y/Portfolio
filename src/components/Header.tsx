import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { MagneticLink } from "@/components/ui/MagneticLink";

const navItems = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
        <div className="flex w-full max-w-3xl items-center justify-between gap-6 rounded-pill border border-border bg-card px-5 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_12px_32px_-16px_rgba(0,0,0,0.18)]">
          <Link to="/" className="font-heading text-sm font-semibold tracking-tight">
            {site.short}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <MagneticLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "inline-block rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground",
                    isActive && "bg-foreground/5 text-foreground",
                  )
                }
              >
                {item.label}
              </MagneticLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs text-muted-foreground">{site.availability}</span>
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative h-8 w-8 md:hidden"
          >
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-foreground transition-transform duration-300 ease-smooth",
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-foreground transition-transform duration-300 ease-smooth",
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
                  end={item.href === "/"}
                  onClick={() => setOpen(false)}
                  className="font-heading text-4xl font-semibold tracking-tight"
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
