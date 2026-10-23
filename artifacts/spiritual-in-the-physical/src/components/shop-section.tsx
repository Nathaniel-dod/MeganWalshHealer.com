import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS, FULL_SHOP_URL } from '@/data/products';

export default function ShopSection({ wrap }: { wrap: (children: ReactNode, delay?: number) => ReactNode }) {
  return (
    <section id="shop" className="border-t-2 border-primary bg-secondary/40 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        {wrap(
          <>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">Shop</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">Products from the DOD shop</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">A small selection of products available through the DOD seller site. Purchases and current pricing are handled entirely on the DOD site.</p>
            <p className="mt-4 max-w-2xl rounded-md border-l-4 border-accent bg-card p-4 text-sm text-foreground" data-testid="text-affiliate-disclosure">
              <strong>Affiliate disclosure:</strong> Megan may earn a commission from purchases made through these affiliate links.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground" data-testid="text-supplement-caution">
              Please consult a qualified healthcare professional and read the seller’s labels before using any supplement.
            </p>
          </>,
        )}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <li key={p.slug} className="flex flex-col border-2 border-primary bg-card" data-testid={`card-product-${p.slug}`}>
              <div className="border-b-2 border-primary bg-background p-4">
                <img src={p.image} alt={p.name} width={600} height={600} loading="lazy" decoding="async" className="aspect-square w-full object-contain" data-testid={`img-product-${p.slug}`} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl font-bold text-primary">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <a href={p.url} target="_blank" rel="sponsored noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid={`link-product-${p.slug}`}>
                  View on DOD <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <a href={FULL_SHOP_URL} target="_blank" rel="sponsored noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:bg-[hsl(232_45%_30%)]" data-testid="link-full-shop">
            Browse the full shop <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
