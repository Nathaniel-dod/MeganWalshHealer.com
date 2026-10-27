import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/public/', import.meta.url);
const read = p => readFile(new URL(p, root), 'utf8');
const paths = ['', 'privacy-policy/', 'terms/', 'disclosures/'];
const canonicals = [];
for (const path of paths) {
  const html = await read(`${path}index.html`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one H1`);
  assert.equal((html.match(/<title>/g) || []).length, 1, `${path}: one title`);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<meta property="og:image" content="https:\/\//);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith('https://'), `${path}: absolute canonical`);
  assert.ok(!canonical.includes('.replit.dev'), 'No development canonical');
  assert.equal(canonical, `https://meganwalshhealer.com/${path}`, `${path}: launch domain`);
  assert.ok(!html.includes('spiritual-in-the-physical.replit.app'), `${path}: no old SEO origin`);
  canonicals.push(canonical);
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(schema, `${path}: JSON-LD exists`);
  const parsed = JSON.parse(schema);
  assert.equal(parsed['@context'], 'https://schema.org');
  if (!path) {
    assert.equal(parsed['@graph'].filter(n => n['@type'] === 'Service').length, 8);
    assert.match(html, /id="services"/);
    assert.match(html, /id="contact"/);
    assert.match(html, /id="shop"/);
    assert.equal((html.match(/data-testid="card-product-/g) || []).length, 7);
    assert.match(html, /Daily Cleansing Tea — 3 Months/);
    assert.ok(!html.includes('Daily Cleansing Tea — 6 Weeks'));
    assert.ok(!html.includes('Daily Cleansing Tea — 1 Year'));
    for (const legal of paths.slice(1)) assert.ok(html.includes(`href="/${legal}"`), `Footer link ${legal}`);
    assert.ok(!html.includes('opacity:0'), 'Prerendered content must not be hidden');
  }
}
assert.equal(new Set(canonicals).size, paths.length, 'Unique canonical per page');
const sitemap = await read('sitemap.xml');
for (const canonical of canonicals) assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
assert.match(await read('robots.txt'), /Sitemap: https:\/\//);
assert.ok((await read('robots.txt')).includes('Sitemap: https://meganwalshhealer.com/sitemap.xml'));
console.log('SEO checks passed: 4 static pages, metadata, JSON-LD, canonical URLs, sitemap, footer links and prerendered services/shop.');
