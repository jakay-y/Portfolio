export interface ProjectImage {
  src: string;
  alt: string;
  label?: string;
  /** Bento layout hint for the case-study gallery — defaults to "half". */
  size?: "full" | "half";
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  description: string[];
  highlights: string[];
  tools: string[];
  /** HSL triplet (no hsl() wrapper), e.g. "152 45% 28%" — this project's signature accent. */
  accent: string;
  image: string;
  /** A tall source image to pan through for a live, moving preview on the case-study page. */
  parallax?: { src: string; imageAspect: number };
  /** Overrides the Home work-deck card only — static, never panned. Leaves the case study untouched. */
  deckImage?: string;
  /** Wraps deckImage in a coded browser-chrome frame — only for a raw screenshot that isn't already a styled mockup. */
  deckFramed?: boolean;
  /** object-fit for the Home deck card's image. All deck cards share the exact same box — "contain" scales content that doesn't natively fit (e.g. a multi-device composite) down to fit inside it, rather than resizing the box. Defaults to "cover". */
  deckFit?: "cover" | "contain";
  /** Real, publicly-visitable URL for this project, shown as a "Visit live site" link on the case study. */
  liveUrl?: string;
  span: "wide" | "square";
  gallery: ProjectImage[];
}

import cruiseMockupLive from "@/assets/projects/cruise-social/mockup-live.png";
import cruiseMockupFeed from "@/assets/projects/cruise-social/mockup-feed.png";

import iziMockupHero from "@/assets/projects/izi/mockup-hero.png";
import iziMockupShop from "@/assets/projects/izi/mockup-shop.png";
import iziMockupLifestyle from "@/assets/projects/izi/mockup-lifestyle.png";
import iziMockupProducts from "@/assets/projects/izi/mockup-products.png";
import iziHeroTall from "@/assets/projects/izi/hero-tall.png";
import iziDeckPreview from "@/assets/projects/izi/deck-preview.png";

import zechMockupHero from "@/assets/projects/zech-oil-gas/mockup-hero.png";
import zechMockupScroll from "@/assets/projects/zech-oil-gas/mockup-scroll.png";
import zechFullPage from "@/assets/projects/zech-oil-gas/full-page.png";

import verifydMockupHero from "@/assets/projects/verifyd/mockup-hero.png";
import verifydDashboard from "@/assets/projects/verifyd/shot-dashboard.png";
import verifydChecking from "@/assets/projects/verifyd/shot-checking.png";
import verifydResult from "@/assets/projects/verifyd/shot-result.png";

export const projects: Project[] = [
  {
    slug: "zech-oil-gas",
    title: "Zech",
    category: "Oil & Gas · Brand Identity · Web",
    year: "2026",
    role: "Brand identity and web design",
    summary:
      "Zech Oil & Gas came to me needing a website that could hold its own in a room full of multinationals.",
    description: [
      "The old site felt generic — nothing about it said “serious energy company.” Zech had the credibility. The website was not showing it. In a room full of multinationals, looking ordinary is the same as looking small.",
      "I started with the business, not the homepage. Mapped services, proof, and how a procurement lead actually scans a site. Then rebuilt the hierarchy around credibility: numbers first, services in plain language, a process a client can follow without a sales call.",
      "Dark tones, tight typography, precise layouts. Every section was designed to make Zech look like the company they already are — technically strong, visually sharp, and still clearly a Port Harcourt company with real roots.",
      "A site that can sit next to IOC partners without shrinking. The work is not decoration on top of the company. It is the company, finally presented that way online.",
    ],
    highlights: [
      "Rebuilt hierarchy around credibility: numbers, services, process",
      "Dark tones, tight typography, precise layout system",
      "Holds its own next to IOC and multinational partners",
      "Full brand identity and website, Port Harcourt roots intact",
    ],
    tools: ["Figma", "HTML/CSS", "Brand Guidelines"],
    accent: "152 45% 26%",
    image: zechMockupHero,
    parallax: { src: zechFullPage, imageAspect: 26308 / 5760 },
    span: "wide",
    gallery: [
      { src: zechMockupHero, alt: "Zech Oil & Gas homepage hero", label: "Homepage", size: "full" },
      { src: zechMockupScroll, alt: "Zech Oil & Gas full page scroll", label: "Full Page", size: "full" },
    ],
  },
  {
    slug: "izi",
    title: "IZI",
    category: "Streetwear E-commerce · Full-Stack Build",
    year: "2026",
    role: "Product design & full-stack development — client project",
    summary:
      "A Nigerian streetwear client's e-commerce platform, built end-to-end — Next.js storefront, Paystack payments, and a custom admin system for managing drops.",
    description: [
      "IZI (“Go Izi, Stay Loud”) is a made-on-demand streetwear brand. I was brought on to design and build the platform end-to-end for the client: Next.js frontend, Express/Supabase backend, live Paystack payment integration, and a bespoke admin dashboard (“IZI Studio”) for managing product drops, orders, and inventory in small, limited batches.",
      "It also includes an interactive style-matching quiz that pairs shoppers with pieces based on four brand “signal” archetypes, instead of a generic size filter.",
    ],
    highlights: [
      "Full Paystack payment integration with pay-on-delivery fallback for local orders",
      "Custom-built admin panel (drop scheduling, live countdown ticker, product/order management)",
      "Interactive AI-style quiz for personalized product matching",
      "Small-batch, made-to-order drop model reflected directly in the UI (no dead stock messaging)",
    ],
    tools: ["Next.js", "Express", "Supabase", "Paystack", "Figma"],
    accent: "350 78% 48%",
    image: iziMockupHero,
    parallax: { src: iziHeroTall, imageAspect: 1700 / 1280 },
    deckImage: iziDeckPreview,
    deckFramed: true,
    liveUrl: "https://iziproductions.netlify.app/",
    span: "wide",
    gallery: [
      { src: iziMockupHero, alt: "IZI homepage hero", label: "Homepage", size: "full" },
      { src: iziMockupShop, alt: "IZI shop product grid", label: "Shop", size: "half" },
      { src: iziMockupLifestyle, alt: "IZI real people, real fits campaign section", label: "Campaign", size: "half" },
      { src: iziMockupProducts, alt: "IZI all products listing page", label: "All Products", size: "full" },
    ],
  },
  {
    slug: "verifyd",
    title: "Verifyd",
    category: "Public Health · Product Verification · Web App",
    year: "2026",
    role: "Product design & front-end build",
    summary:
      "A NAFDAC product-verification tool that lets anyone confirm a drug or product is real before they trust it.",
    description: [
      "Counterfeit and substandard drugs are a real, dangerous problem in Nigeria — and an ordinary buyer standing in front of a pack of paracetamol has no fast way to check it before they trust it.",
      "I designed Verifyd around one action: enter the NAFDAC registration number, get a straight answer. The flow reduces to three steps — enter details, check the database, view the result — with a barcode scan as a fallback to typing. No login, no friction.",
      "A calm, credible interface carries the whole thing: live verification stats up front, a clear step tracker while it checks, and a result screen written to read like an official confirmation rather than a guess.",
      "The outcome is a five-second check in a moment that used to be a shrug. Verified or not, the person leaves knowing.",
    ],
    highlights: [
      "Three-step verification flow: enter details, check database, view result",
      "Live dashboard: authentic vs. flagged-fake products, reports filed",
      "Barcode scan as a fallback to manual entry",
      "Result screen designed to read as an official confirmation",
    ],
    tools: ["Figma"],
    accent: "266 55% 52%",
    image: verifydMockupHero,
    span: "square",
    gallery: [
      { src: verifydMockupHero, alt: "Verifyd product screens", label: "Overview", size: "full" },
      { src: verifydDashboard, alt: "Verifyd live verification dashboard", label: "Dashboard", size: "half" },
      { src: verifydChecking, alt: "Verifyd checking database step", label: "Checking", size: "half" },
      { src: verifydResult, alt: "Verifyd product verified result screen", label: "Result", size: "full" },
    ],
  },
  {
    slug: "cruise-social",
    title: "Cruise",
    category: "Social · Mobile App",
    year: "2023",
    role: "End-to-end product design",
    summary:
      "A social app for a younger Nigerian audience tired of platforms that weren't built with them in mind.",
    description: [
      "Everyone knows what a social app is — so you can’t confuse them, but you also can’t be boring. Younger Nigerian users were tired of platforms that were not built with them in mind. The product had to feel local without looking like a copy.",
      "I treated the five core surfaces as one system, not five screens: Feed, Friends, Explore, LIVE, and Messages. Each needed its own personality, but the same hand. Tabs that make sense. A palette that carries energy without noise.",
      "Sage-green palette, clean cards, and a feed that already knows how you scroll. Five core screens — Feed, Friends, Explore, LIVE, and Messages — each with its own rhythm inside the same language.",
      "A social product that feels fresh without making people relearn how to use it. Local energy, global execution — the brief, held all the way through the system.",
    ],
    highlights: [
      "Five core surfaces, one visual language",
      "Sage-green palette built for a younger Nigerian audience",
      "Local energy, global execution",
      "A feed that already knows how you scroll",
    ],
    tools: ["Figma", "Prototyping", "User Research"],
    accent: "140 22% 42%",
    image: cruiseMockupFeed,
    deckImage: cruiseMockupFeed,
    deckFit: "contain",
    span: "wide",
    gallery: [
      { src: cruiseMockupLive, alt: "Cruise Social LIVE and Friends tabs", label: "Live & Friends", size: "full" },
      { src: cruiseMockupFeed, alt: "Cruise Social My Feed and Explore tabs", label: "Feed & Explore", size: "full" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return projects[0];
  return projects[(i + 1) % projects.length];
}
