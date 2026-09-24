import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoteWordProps {
  label: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  children: ReactNode;
}

/** An underlined inline phrase that opens a small note on click/tap or
 * keyboard focus — closes on outside click or Escape. Open state is lifted
 * to the parent so only one note is ever open at a time. */
export function NoteWord({ label, openId, setOpenId, children }: NoteWordProps) {
  const id = useId();
  const isOpen = openId === id;
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpenId]);

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`note-panel-${id}`}
        onClick={() => setOpenId(id)}
        onFocus={() => setOpenId(id)}
        className="rounded-sm bg-transparent p-0 font-[inherit] text-[inherit] underline decoration-1 underline-offset-[0.28em] decoration-muted-foreground/50 transition-colors duration-200 hover:decoration-foreground focus-visible:outline-none focus-visible:decoration-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {label}
      </button>

      <div
        id={`note-panel-${id}`}
        role="group"
        aria-hidden={!isOpen}
        className={cn(
          "absolute left-1/2 top-full z-50 mt-3 w-[min(20rem,calc(100vw-3rem))] -translate-x-1/2 rounded-[1.25rem] border border-border bg-card p-5 text-left font-sans text-base font-normal normal-case tracking-normal shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-smooth motion-reduce:transition-none",
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </span>
  );
}
