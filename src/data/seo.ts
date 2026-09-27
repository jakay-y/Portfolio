/**
 * Page metadata — the single source for <title>, description and Open Graph tags.
 * Plain data (no asset imports) so vite.config.ts and scripts/og can read it too.
 * Keep project summaries in step with src/data/projects.ts.
 */

/** Production origin, used for canonical URLs and absolute og:image links. */
export const SITE_URL = "https://justicenweke.com";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Path under /public, e.g. "/og/default.png". */
  image: string;
}

export const DEFAULT_META: PageMeta = {
  path: "/",
  title: "Justice Nweke — Designer & Engineer",
  description:
    "I design and build brands, interfaces and full-stack products for founders in oil & gas, fintech, healthcare and retail. From Figma to production — no handoff.",
  image: "/og/default.png",
};

export const SEO_PROJECTS = [
  {
    slug: "zech-oil-gas",
    title: "Zech",
    summary: "Zech Oil & Gas came to me needing a website that could hold its own in a room full of multinationals.",
    cover: "src/assets/projects/zech-oil-gas/mockup-hero.webp",
  },
  {
    slug: "izi",
    title: "IZI",
    summary:
      "A Nigerian streetwear client's e-commerce platform, built end-to-end — Next.js storefront, Paystack payments, and a custom admin system for managing drops.",
    cover: "src/assets/projects/izi/deck-preview.webp",
  },
  {
    slug: "verifyd",
    title: "Verifyd",
    summary: "A NAFDAC product-verification tool that lets anyone confirm a drug or product is real before they trust it.",
    cover: "src/assets/projects/verifyd/mockup-hero.webp",
  },
  {
    slug: "cruise-social",
    title: "Cruise",
    summary: "A social app for a younger Nigerian audience tired of platforms that weren't built with them in mind.",
    cover: "src/assets/projects/cruise-social/mockup-feed.webp",
  },
];

export const PAGE_META: PageMeta[] = [
  DEFAULT_META,
  {
    path: "/about",
    title: "About — Justice Nweke",
    description:
      "Designer and engineer in Port Harcourt, working worldwide. I help founders define what a product should feel like, then build it.",
    image: "/og/default.png",
  },
  {
    path: "/contact",
    title: "Start a project — Justice Nweke",
    description: "Tell me what you're building — brand, website or product. I reply within 24 hours.",
    image: "/og/default.png",
  },
  ...SEO_PROJECTS.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} — Case study · Justice Nweke`,
    description: p.summary,
    image: `/og/${p.slug}.png`,
  })),
];

export function metaFor(path: string): PageMeta {
  return PAGE_META.find((m) => m.path === path) ?? DEFAULT_META;
}
