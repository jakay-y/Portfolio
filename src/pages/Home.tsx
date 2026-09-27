import { useRef } from "react";
import { site } from "@/lib/site";
import { projects } from "@/data/projects";
import { ProjectCarousel3D } from "@/components/motion/ProjectCarousel3D";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { HeroSequence } from "@/components/hero/HeroSequence";
import { CapabilitiesBento, type BentoTile } from "@/components/CapabilitiesBento";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { ScrollEnter } from "@/components/motion/ScrollEnter";
import { useTrackWorkInView } from "@/hooks/use-work-in-view";

const capabilityTiles: BentoTile[] = site.skills.map((group, i) => ({
  title: group.title,
  items: [...group.items],
  span: i === 0 ? "wide" : i === 2 ? "full" : "normal",
  glyphType: i,
}));

export function Home() {
  const workRef = useRef<HTMLElement>(null);
  useTrackWorkInView(workRef);


  return (
    <div>
      <HeroSequence />

      {/* Work — the hero's "Here's what that looks like." hands straight off to the carousel */}
      <section ref={workRef} id="work" className="pb-section">
        <ProjectCarousel3D projects={projects} />
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
