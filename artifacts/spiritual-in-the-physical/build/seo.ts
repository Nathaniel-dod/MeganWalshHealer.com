import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { LEGAL_PAGES, renderLegalPage } from './legal-pages';

// User-approved canonical domain for the Cloudflare launch.
export const SITE_ORIGIN = 'https://meganwalshhealer.com';
const TITLE = 'Megan Walsh | Spiritual in the Physical, Michigan & Online';
const DESCRIPTION = 'Explore Wolfe Non Surgical, CellSonic, Reiki and spiritual readings with Megan Walsh. In-person services in Michigan and online consultations and readings.';
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
const url = (base: string, suffix = '') => new URL(`${base}${suffix}`, SITE_ORIGIN).href;

function graph(base: string) {
  const home = url(base);
  const business = `${home}#organization`;
  const person = `${home}#megan-walsh`;
  const services = [
    ['Wolfe Non Surgical', false], ['CellSonic Regeneration', false],
    ['Perfect Day Consults', true], ['Reiki Healing', false], ['Palm Readings', false],
    ['Intuitive Tarot Readings', true], ['Mediumship Readings', true], ['Ordained Ministry', false],
  ] as const;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': business, name: 'Spiritual in the Physical', url: home, logo: url(base, 'logo.png'), founder: { '@id': person }, areaServed: { '@type': 'State', name: 'Michigan' } },
      { '@type': 'Person', '@id': person, name: 'Megan Walsh', url: `${home}#about`, image: url(base, 'meghan-walsh.jpg'), worksFor: { '@id': business }, jobTitle: 'Spiritual practitioner and ordained minister' },
      { '@type': 'WebSite', '@id': `${home}#website`, url: home, name: 'Spiritual in the Physical', publisher: { '@id': business }, inLanguage: 'en-US' },
      { '@type': 'WebPage', '@id': `${home}#webpage`, url: home, name: TITLE, description: DESCRIPTION, isPartOf: { '@id': `${home}#website` }, about: { '@id': person }, primaryImageOfPage: { '@type': 'ImageObject', url: url(base, 'hero-celestial.png'), width: 1024, height: 576 } },
      ...services.map(([name, online], i) => ({
        '@type': 'Service', '@id': `${home}#service-${i + 1}`, name,
        provider: { '@id': business }, url: `${home}#services`,
        ...(online
          ? { availableChannel: { '@type': 'ServiceChannel', name: 'Online service', serviceUrl: `${home}#contact` } }
          : { areaServed: { '@type': 'State', name: 'Michigan', description: 'Michigan and surrounding areas' } }),
      })),
    ],
  };
}

export function seoHead(base: string, page?: (typeof LEGAL_PAGES)[number]) {
  const canonical = url(base, page ? `${page.path}/` : '');
  const title = page ? `${page.title} | Spiritual in the Physical` : TITLE;
  const description = page?.description ?? DESCRIPTION;
  const image = url(base, 'hero-celestial.png');
  const schema = page ? {
    '@context': 'https://schema.org', '@type': 'WebPage', url: canonical,
    name: title, description, inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'Spiritual in the Physical', url: url(base) },
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: url(base) },
      { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
    ] },
  } : graph(base);
  return `<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#25274f">
<meta name="author" content="Megan Walsh">
<link rel="canonical" href="${escape(canonical)}">
<meta property="og:site_name" content="Spiritual in the Physical">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${escape(image)}">
<meta property="og:image:width" content="1024">
<meta property="og:image:height" content="576">
<meta property="og:image:alt" content="Celestial clouds and a luminous figure — Spiritual in the Physical">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${escape(image)}">
<meta name="twitter:image:alt" content="Celestial clouds and a luminous figure — Spiritual in the Physical">
<link rel="icon" type="image/svg+xml" href="${base}favicon.svg">
<script type="application/ld+json">${json(schema)}</script>`;
}

export function seoPlugin(): Plugin {
  let config: ResolvedConfig;
  let rendered = '';
  const robots = () => `User-agent: *\nAllow: /\nSitemap: ${url(config.base, 'sitemap.xml')}\n`;
  const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', ...LEGAL_PAGES.map(p => `${p.path}/`)].map(p => `<url><loc>${escape(url(config.base, p))}</loc></url>`).join('')}</urlset>`;
  return {
    name: 'site-seo-and-static-legal',
    configResolved(resolved) { config = resolved; },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '/').split('?')[0];
        const page = LEGAL_PAGES.find(p => pathname === `${config.base}${p.path}/` || pathname === `${config.base}${p.path}`);
        let body: string;
        let type = 'text/html; charset=utf-8';
        if (page) body = renderLegalPage(page, seoHead(config.base, page), config.base);
        else if (pathname === `${config.base}sitemap.xml`) { body = sitemap(); type = 'application/xml; charset=utf-8'; }
        else if (pathname === `${config.base}robots.txt`) { body = robots(); type = 'text/plain; charset=utf-8'; }
        else return next();
        res.statusCode = 200;
        res.setHeader('Content-Type', type);
        res.end(body);
      });
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (config.command === 'build' && !rendered) {
          // Render real React content at build time so the static Cloudflare
          // output is readable to crawlers without executing JavaScript.
          const { createServer } = await import('vite');
          const ssr = await createServer({
            configFile: false, root: config.root, base: config.base,
            cacheDir: path.join(config.root, 'node_modules/.vite-prerender'),
            server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom',
            resolve: { alias: { '@': path.join(config.root, 'src') }, dedupe: ['react', 'react-dom'] },
            esbuild: { jsx: 'automatic' },
          });
          try {
            const entry = await ssr.ssrLoadModule('/src/entry-server.tsx');
            rendered = entry.render();
          } finally { await ssr.close(); }
        }
        return html.replace('<!-- SEO_HEAD -->', seoHead(config.base))
          .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
      },
    },
    generateBundle() {
      for (const page of LEGAL_PAGES) this.emitFile({
        type: 'asset', fileName: `${page.path}/index.html`,
        source: renderLegalPage(page, seoHead(config.base, page), config.base),
      });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots() });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
      this.emitFile({ type: 'asset', fileName: '_redirects', source: LEGAL_PAGES.map(p => `${config.base}${p.path} ${config.base}${p.path}/ 301`).join('\n') + '\n' });
    },
  };
}
