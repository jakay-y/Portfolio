interface KineticTextProps {
  text: string;
  className?: string;
  delayStart?: number;
}

/** Splits text into words and reveals them with a staggered slide-up-and-in on load. Pure CSS — runs reliably regardless of any JS animation engine. */
export function KineticText({ text, className, delayStart = 0 }: KineticTextProps) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block animate-fade-up opacity-0"
            style={{ animationDelay: `${delayStart + i * 0.08}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
