import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_META, PAGE_META, SITE_URL, type PageMeta } from './src/data/seo.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function metaTags(meta: PageMeta) {
  const url = `${SITE_URL}${meta.path}`
  const image = `${SITE_URL}${meta.image}`
  const t = escapeHtml(meta.title)
  const d = escapeHtml(meta.description)
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Justice Nweke" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

const META_BLOCK = /<!-- meta:start[\s\S]*?<!-- meta:end -->/
const BUILT_META_BLOCK = /<title>[\s\S]*?<meta name="twitter:image"[^>]*>/

/**
 * Link previews (WhatsApp, LinkedIn, X) don't run JavaScript, so every route gets its own
 * HTML file with its title, description and OG image baked in: dist/work/<slug>/index.html etc.
 */
function perRouteMeta(): Plugin {
  let outDir = 'dist'
  return {
    name: 'per-route-meta',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return html.replace(META_BLOCK, metaTags(DEFAULT_META))
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexPath)) return
      const html = fs.readFileSync(indexPath, 'utf8')
      const urls = PAGE_META.map((m) => `  <url><loc>${SITE_URL}${m.path}</loc></url>`).join('\n')
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
      for (const meta of PAGE_META) {
        if (meta.path === '/') continue
        const target = path.join(outDir, meta.path, 'index.html')
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, html.replace(BUILT_META_BLOCK, metaTags(meta)))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), perRouteMeta()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
