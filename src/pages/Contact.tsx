import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export function Contact() {
  return (
    <div className="px-6 py-[calc(theme(spacing.section)+2rem)] md:px-12">
      <div className="mx-auto w-full max-w-3xl text-center">
        <Reveal>
          <span className="font-mono text-eyebrow uppercase text-muted-foreground">Contact</span>
          <h1 className="mt-4 font-heading text-display-lg font-medium tracking-tight">
            Let's talk about your next product.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            {site.availability} — based in {site.location}, {site.locationNote}. Send a message and it'll land
            straight in my inbox.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-4xl max-w-xl rounded-[2rem] border border-border bg-card p-xl text-left sm:p-2xl">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-xl text-sm text-muted-foreground">
            Prefer email directly?{" "}
            <a href={`mailto:${site.email}`} className="text-foreground underline underline-offset-4">
              {site.email}
            </a>
          </p>
        </Reveal>

        <StaggerGroup className="mt-4xl flex flex-wrap items-center justify-center gap-3 border-t border-border pt-xl">
          {site.socials
            .filter((s) => s.label !== "Email")
            .map((s) => (
              <StaggerItem key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-pill border border-border px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground"
                >
                  {s.label} · {s.value}
                </a>
              </StaggerItem>
            ))}
        </StaggerGroup>
      </div>
    </div>
  );
}
