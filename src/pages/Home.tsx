import { site } from "@/lib/site";
import { projects } from "@/data/projects";
import { WorkDeck } from "@/components/motion/WorkDeck";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { KineticText } from "@/components/motion/KineticText";
import { CapabilitiesBento, type BentoTile } from "@/components/CapabilitiesBento";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { ScrollEnter } from "@/components/motion/ScrollEnter";

const capabilityTiles: BentoTile[] = site.skills.map((group, i) => ({
  title: group.title,
  items: [...group.items],
  span: i === 0 ? "wide" : i === 2 ? "full" : "normal",
  glyphType: i,
}));

export function Home() {
  return (
    <div>
      {/* Hero — asymmetric split, staggered offset */}
      <section className="px-6 pb-section pt-[calc(theme(spacing.section)+2rem)] md:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1 font-mono text-eyebrow uppercase text-muted-foreground">
                {site.availability}
              </span>
            </Reveal>
            <h1 className="mt-6 font-heading text-display-xl font-medium tracking-tight">
              <KineticText text={site.name} delayStart={0.15} />
            </h1>
            <Reveal delay={0.1}>
              <p className="mt-3 max-w-xl font-heading text-heading-md font-medium text-muted-foreground">
                {site.role}
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-4 md:mt-20">
            <Reveal delay={0.15}>
              <p className="text-lg leading-relaxed text-muted-foreground">{site.headline}</p>
              <p className="mt-6 text-sm text-faint">
                {site.location} — {site.locationNote}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-4xl grid max-w-6xl grid-cols-2 gap-6 border-t border-border pt-xl md:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.l}>
                <p className="font-heading text-3xl font-semibold tracking-tight">{s.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Work deck — cards stack in 3D as you scroll past them */}
      <section className="pb-section">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">Selected Work</span>
            <h2 className="mt-3 font-heading text-heading-lg font-semibold tracking-tight">
              Products people actually use.
            </h2>
          </Reveal>
        </div>

        <WorkDeck projects={projects} />
      </section>

      {/* Capabilities — asymmetric bento, soft aurora backdrop */}
      <section className="relative overflow-hidden border-t border-border px-6 py-section md:px-12">
        <AuroraBackdrop />

        <ScrollEnter className="relative mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">Capabilities</span>
            <h2 className="mt-3 max-w-2xl font-heading text-heading-lg font-semibold tracking-tight">
              Design that goes from brief to shipped product.
            </h2>
          </Reveal>

          <CapabilitiesBento tiles={capabilityTiles} className="mt-3xl" />
        </ScrollEnter>
      </section>

      {/* Tools strip */}
      <section className="overflow-hidden px-6 py-3xl md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">Toolkit</span>
          </Reveal>
          <Parallax strength={30}>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-pill border border-border px-4 py-2 text-sm text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Parallax>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 pb-4xl pt-3xl md:px-12">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-border bg-card p-xl md:flex-row md:items-center md:p-4xl">
            <h2 className="max-w-md font-heading text-heading-lg font-semibold tracking-tight">
              Have a product that needs to feel inevitable?
            </h2>
            <Button href="/contact">Start a project</Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
