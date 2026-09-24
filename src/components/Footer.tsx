import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  return (
    <footer className="bg-primary px-6 pb-10 pt-4xl text-primary-foreground md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-heading text-display-lg font-medium tracking-tight">
            Let's build something <span className="italic">inevitable.</span>
          </p>
        </Reveal>

        <div className="mt-xl">
          <Button href={`mailto:${site.email}`} variant="ghost" className="border-white/20 text-white hover:border-white">
            {site.email}
          </Button>
        </div>

        <div className="mt-4xl flex flex-col gap-8 border-t border-white/10 pt-xl md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-heading text-lg font-semibold">{site.name}</p>
            <p className="mt-1 text-sm text-white/50">
              {site.location} — {site.locationNote}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            {site.socials
              .filter((s) => s.label !== "Email")
              .map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <p className="mt-xl text-xs text-white/30">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
