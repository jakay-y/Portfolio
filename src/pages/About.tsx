import { useState } from "react";
import { Link } from "react-router-dom";
import { site } from "@/lib/site";
import { processSteps } from "@/data/process";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollEnter } from "@/components/motion/ScrollEnter";
import { CapabilitiesBento, type BentoTile } from "@/components/CapabilitiesBento";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { ProcessSection } from "@/components/ProcessSection";
import { NoteWord } from "@/components/NoteWord";
import { LiveTimeWAT } from "@/components/LiveTimeWAT";
import { Button } from "@/components/ui/Button";
import profilePhoto from "@/assets/profile/justice.jpeg";

const whatIDoTiles: BentoTile[] = [
  ...site.skills.map((group, i) => ({
    title: group.title,
    items: [...group.items],
    span: (i === 1 ? "normal" : "wide") as BentoTile["span"],
    glyphType: i,
  })),
  { title: "Stack", items: [...site.stack], span: "normal", glyphType: 3, chips: true },
];

export function About() {
  const [openNote, setOpenNote] = useState<string | null>(null);

  return (
    <div>
      <header className="px-6 pb-3xl pt-[calc(theme(spacing.section)+2rem)] md:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <span className="font-mono text-eyebrow uppercase text-muted-foreground">About</span>
              <h1 className="mt-4 max-w-xl font-heading text-display-lg font-medium tracking-tight">
                Design that starts with the business, not the mockup.
              </h1>
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:-mt-20">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-border">
                <img
                  src={profilePhoto}
                  alt={site.name}
                  className="aspect-[4/5] w-full object-cover"
                  loading="eager"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <section className="px-6 pb-section md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-xl md:grid-cols-4">
              {site.stats.map((s) => (
                <div key={s.l}>
                  <p className="font-heading text-3xl font-semibold tracking-tight">{s.n}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* What I do — same bento grid as the landing page */}
      <section className="relative overflow-hidden border-t border-border px-6 py-section md:px-12">
        <AuroraBackdrop />

        <ScrollEnter className="relative mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">What I do</span>
            <h2 className="mt-3 max-w-2xl font-heading text-heading-lg font-semibold tracking-tight">
              Design that goes from brief to shipped product.
            </h2>
          </Reveal>

          <CapabilitiesBento tiles={whatIDoTiles} className="mt-3xl" />
        </ScrollEnter>
      </section>

      {/* How I work */}
      <ProcessSection steps={processSteps} />

      {/* About — one statement, a few things worth clicking on */}
      <section className="border-t border-border px-6 py-section md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal className="relative z-20">
            <div className="font-heading text-display-lg font-medium leading-[1.15] tracking-tight">
              <NoteWord label="Justice" openId={openNote} setOpenId={setOpenNote}>
                Product designer and developer. I take products from a blank page to something people
                actually use — usually solo, sometimes with a small team.
              </NoteWord>{" "}
              — designer and builder working out of{" "}
              <NoteWord label="Port Harcourt" openId={openNote} setOpenId={setOpenNote}>
                It's currently <LiveTimeWAT /> in Port Harcourt, Nigeria. I work with clients across time
                zones, so don't worry about matching mine.
              </NoteWord>
              , shipping products across{" "}
              <NoteWord label="fintech, healthcare and ERP" openId={openNote} setOpenId={setOpenNote}>
                Payments platforms, healthcare booking systems, and ERP tools for logistics-heavy
                businesses. Different domains, same process: understand the business first.
              </NoteWord>
              . I like to{" "}
              <NoteWord label="design it and build it" openId={openNote} setOpenId={setOpenNote}>
                {site.stack.join(", ")} — the same person from sketch to shipped product, so nothing gets
                lost in translation between design and code.
              </NoteWord>{" "}
              myself, and every so often that turns into{" "}
              <NoteWord label="my own products" openId={openNote} setOpenId={setOpenNote}>
                <span className="block">
                  <strong className="font-semibold text-foreground">IZI</strong> — a streetwear store I
                  designed and built (Next.js, Supabase, Paystack).{" "}
                  <Link to="/work/izi" className="text-accent underline underline-offset-4 hover:text-accent-deep">
                    View case study ↗
                  </Link>
                </span>
                <span className="mt-3 block">
                  <strong className="font-semibold text-foreground">GatePass</strong> — ticketing and
                  payments for leisure parks.
                </span>
              </NoteWord>
              .
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-3xl">
              <Button href="/contact">Start a project</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tools */}
      <section className="px-6 py-section md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">Tools</span>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.tools.map((tool) => (
                <span key={tool} className="rounded-pill border border-border px-4 py-2 text-sm text-muted-foreground">
                  {tool}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
