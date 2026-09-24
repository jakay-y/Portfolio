interface BrowserFrameProps {
  src: string;
  alt: string;
  url?: string;
  className?: string;
}

/** Static macOS-style browser chrome around a screenshot — fills its parent's height. Used for one-off "dress this raw screenshot up" cases, not for already-styled mockups. */
export function BrowserFrame({ src, alt, url = "site.com", className }: BrowserFrameProps) {
  return (
    <div className={`flex h-full w-full flex-col bg-[#111113] p-2 ${className ?? ""}`}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[calc(1rem-8px)] bg-white">
        <div className="flex shrink-0 items-center gap-3 border-b border-black/5 bg-[#f2f2f2] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 rounded-md bg-white px-3 py-0.5 text-center text-[10px] text-muted-foreground ring-1 ring-black/5">
            {url}
          </div>
        </div>
        <img src={src} alt={alt} className="min-h-0 flex-1 w-full object-cover object-top" loading="lazy" />
      </div>
    </div>
  );
}
