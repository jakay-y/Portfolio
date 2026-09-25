import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { LiveTimeWAT } from "@/components/LiveTimeWAT";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

const footerNav = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function CornerBrackets() {
  const base = "pointer-events-none absolute h-6 w-6 border-white/25";
  return (
    <>
      <span className={cn(base, "left-0 top-0 border-l border-t")} aria-hidden />
      <span className={cn(base, "right-0 top-0 border-r border-t")} aria-hidden />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} aria-hidden />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} aria-hidden />
    </>
  );
}

function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const pull = useMagnetic(ref, 8);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
      aria-label="Back to top"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:border-white"
    >
      <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary px-6 pb-10 pt-4xl text-primary-foreground md:px-12">
      <AuroraBackdrop />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative rounded-[2rem] border border-white/10 px-6 py-4xl sm:px-4xl">
          <CornerBrackets />

          <Reveal blur y={32}>
            <span className="font-mono text-eyebrow uppercase text-white/40">[ Let's talk ]</span>
            <p className="mt-4 font-heading text-display-lg font-medium tracking-tight">
              Let's build something <span className="italic text-accent">inevitable.</span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-xl">
              <Button
                href={`mailto:${site.email}`}
                variant="ghost"
                className="border-white/20 text-white hover:border-white"
              >
                {site.email}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-4xl grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-xl sm:grid-cols-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">[ Nav ]</span>
                <ul className="mt-4 space-y-2.5">
                  {footerNav.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href} className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">[ Socials ]</span>
                <ul className="mt-4 space-y-2.5">
                  {site.socials
                    .filter((s) => s.label !== "Email")
                    .map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">[ Status ]</span>
                <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  {site.availability}
                </p>
                <p className="mt-2 text-sm text-white/50">
                  {site.location} — <LiveTimeWAT />
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Giant watermark — the site's closing signature */}
        <Reveal delay={0.1}>
          <p
            aria-hidden="true"
            className="mt-4xl select-none overflow-hidden whitespace-nowrap text-center font-heading text-[clamp(2.75rem,13vw,9rem)] font-semibold uppercase leading-none tracking-tight text-white/[0.06]"
          >
            {site.name}
          </p>
        </Reveal>

        <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-xl text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
