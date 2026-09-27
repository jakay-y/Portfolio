import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <Reveal>
        <span className="font-mono text-eyebrow uppercase text-muted-foreground">Error 404</span>
        <h1 className="mt-5 font-heading text-display-lg font-medium tracking-[-0.03em]">
          Designed, built,
          <br />
          <span className="text-faint">never shipped.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-muted-foreground">
          This page didn’t make it past the prototype. Everything that did is one click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button href="/#work">See the work</Button>
          <Link
            to="/contact"
            className="group relative rounded-sm py-1 text-sm font-medium text-foreground"
          >
            Start a project →
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-small group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
