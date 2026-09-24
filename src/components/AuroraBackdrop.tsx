/** Soft blurred gradient blobs — the backdrop used behind bento-grid sections. */
export function AuroraBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,hsl(266_65%_58%/0.32),transparent_70%)] blur-[100px]" />
      <div className="absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,hsl(28_85%_60%/0.26),transparent_70%)] blur-[100px]" />
    </div>
  );
}
