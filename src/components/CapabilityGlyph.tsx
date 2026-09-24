interface CapabilityGlyphProps {
  type: number;
  className?: string;
}

/** Small abstract line marks — one per capability category, ultra-light stroke, no icon-font clutter. */
export function CapabilityGlyph({ type, className }: CapabilityGlyphProps) {
  const common = { width: 30, height: 30, viewBox: "0 0 30 30", fill: "none", strokeWidth: 1 };

  if (type === 0) {
    return (
      <svg {...common} className={className}>
        <rect x="3" y="3" width="16" height="16" rx="4" stroke="currentColor" />
        <rect x="12" y="12" width="15" height="15" rx="4" stroke="currentColor" strokeOpacity="0.45" />
      </svg>
    );
  }
  if (type === 1) {
    return (
      <svg {...common} className={className}>
        <path d="M15 3 27 26H3z" stroke="currentColor" strokeLinejoin="round" />
        <circle cx="15" cy="17" r="3" stroke="currentColor" strokeOpacity="0.45" />
      </svg>
    );
  }
  if (type === 3) {
    return (
      <svg {...common} className={className}>
        <rect x="4" y="16" width="10" height="10" rx="3" stroke="currentColor" strokeOpacity="0.45" />
        <rect x="14" y="9" width="10" height="10" rx="3" stroke="currentColor" strokeOpacity="0.7" />
        <rect x="9" y="2" width="10" height="10" rx="3" stroke="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common} className={className}>
      <circle cx="15" cy="15" r="12" stroke="currentColor" strokeOpacity="0.45" />
      <path d="M15 15 24 8" stroke="currentColor" />
      <circle cx="15" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}
