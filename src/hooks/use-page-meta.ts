import { useEffect } from "react";
import { PAGE_META, SITE_URL, metaFor } from "@/data/seo";

function setTag(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Keeps <title>, description, canonical and OG tags in step with client-side navigation. */
export function usePageMeta(pathname: string) {
  useEffect(() => {
    const known = PAGE_META.some((m) => m.path === pathname);
    const meta = metaFor(pathname);
    const title = known ? meta.title : "Not found — Justice Nweke";
    const url = `${SITE_URL}${pathname}`;
    document.title = title;
    setTag('meta[name="description"]', "content", meta.description);
    setTag('link[rel="canonical"]', "href", url);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[property="og:title"]', "content", title);
    setTag('meta[property="og:description"]', "content", meta.description);
    setTag('meta[property="og:image"]', "content", `${SITE_URL}${meta.image}`);
    setTag('meta[name="twitter:title"]', "content", title);
    setTag('meta[name="twitter:description"]', "content", meta.description);
    setTag('meta[name="twitter:image"]', "content", `${SITE_URL}${meta.image}`);
  }, [pathname]);
}
