import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <Reveal>
        <span className="font-heading text-8xl font-semibold tracking-tight text-faint">404</span>
        <h1 className="mt-4 font-heading text-heading-lg font-semibold tracking-tight">
          This page doesn't exist.
        </h1>
        <p className="mt-3 text-muted-foreground">Let's get you back to the work.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Back home</Button>
        </div>
      </Reveal>
    </div>
  );
}
