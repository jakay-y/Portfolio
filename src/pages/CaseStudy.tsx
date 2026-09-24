import { useParams } from "react-router-dom";
import { getNextProject, getProject } from "@/data/projects";
import { ParallaxPan } from "@/components/motion/ParallaxPan";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { NotFound } from "@/pages/NotFound";

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) return <NotFound />;

  const next = getNextProject(project.slug);
  const isBento = project.gallery.some((image) => image.size);

  return (
    <article>
      <header className="px-6 pb-section pt-[calc(theme(spacing.section)+2rem)] md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-eyebrow uppercase text-muted-foreground">
              {project.category} · {project.year}
            </span>
            <h1 className="mt-4 font-heading text-display-lg font-medium tracking-tight">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.summary}</p>
          </Reveal>
        </div>
      </header>

      <section className="px-6 pb-section md:px-12">
        <div className="mx-auto max-w-6xl">
          {isBento ? (
            <div className="grid grid-cols-1 gap-x-10 gap-y-4xl sm:grid-cols-2">
              {project.gallery.map((image, i) => {
                const isHero = project.parallax && image.src === project.image;
                return (
                  <Reveal key={image.src} delay={i * 0.06} className={image.size === "full" ? "sm:col-span-2" : "sm:col-span-1"}>
                    {isHero && project.parallax ? (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
                        <ParallaxPan
                          src={project.parallax.src}
                          alt={image.alt}
                          imageAspect={project.parallax.imageAspect}
                          containerAspect={10 / 16}
                          duration={22}
                        />
                      </div>
                    ) : (
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
                      />
                    )}
                    {image.label && (
                      <span className="mt-4 block text-xs uppercase tracking-[0.2em] text-faint">
                        {image.label}
                      </span>
                    )}
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-[2rem] bg-foreground/[0.03] p-3 ring-1 ring-border sm:p-6">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {project.gallery.map((image) => (
                    <div key={image.src} className="flex flex-col items-center gap-3">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="mx-auto w-full max-w-[240px] rounded-[1.75rem] ring-1 ring-border"
                      />
                      {image.label && (
                        <span className="text-xs uppercase tracking-[0.2em] text-faint">{image.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="px-6 pb-section md:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
          <div className="md:col-span-7 space-y-6">
            {project.description.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-lg leading-relaxed text-muted-foreground">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <Reveal>
              <div className="rounded-[1.5rem] border border-border p-xl">
                <span className="font-mono text-eyebrow uppercase text-muted-foreground">Role</span>
                <p className="mt-2 font-heading text-heading-md font-semibold tracking-tight">{project.role}</p>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent underline underline-offset-4 hover:text-accent-deep"
                  >
                    Visit live site ↗
                  </a>
                )}

                <span className="mt-8 block font-mono text-eyebrow uppercase text-muted-foreground">Tools</span>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <span className="mt-8 block font-mono text-eyebrow uppercase text-muted-foreground">Highlights</span>
                <ul className="mt-3 space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={h} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-faint">0{i + 1}</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-t border-border px-6 py-4xl md:px-12">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-eyebrow uppercase text-muted-foreground">Next project</span>
              <h2 className="mt-2 font-heading text-heading-lg font-semibold tracking-tight">{next.title}</h2>
            </div>
            <Button href={`/work/${next.slug}`}>View project</Button>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
