# Spiritual in the Physical

A one-page practitioner website introducing services and collecting general enquiries.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/spiritual-in-the-physical/` — public website.
- `artifacts/api-server/` — enquiry submission API.
- `lib/api-spec/openapi.yaml` — API contract.
- `lib/db/src/schema/` — persisted enquiries.

## Architecture decisions

- The public contact form submits directly to Web3Forms for email delivery. Success requires an HTTP success and Web3Forms `success: true`; failures preserve the visitor’s fields. Do not send real test submissions until launch, as requested by the user.
- The user's intended hosting destination is Cloudflare. Preserve portability; the contact API and database need a deliberate Cloudflare-compatible deployment or external backend rather than assuming a static upload includes them.
- Web3Forms now handles new public enquiries without the project API/database, allowing static Cloudflare hosting. Preserve the earlier enquiry database and API; do not delete historical data without permission. The public form key is intentionally client-visible; recipient routing is managed in Megan’s Web3Forms account.
- SEO metadata, schema, sitemap and static legal pages are generated at build time using the user-approved launch domain `https://meganwalshhealer.com`. Keep canonical links, sharing metadata, schema and sitemap consistent with this domain.
- Privacy disclosures must follow actual processing. When connecting Web3Forms or changing tracking, update the legal content as well as the form notices. The policies are factual starter text and need the operator's legal review before launch.
- Do not collect sensitive health information in the public form.
- The general contact form must not solicit health details. The separate Perfect Day Consult intake is intentionally unlisted, excluded from the sitemap and marked noindex; it is not password-protected or guaranteed confidential. The user explicitly chose Web3Forms for its sensitive responses after the privacy implications were explained. Preserve the uploaded questionnaire exactly, use no browser persistence, and do not claim verified medical/HIPAA compliance or a verified special Web3Forms tier.
- Do not invent practitioner credentials, health outcomes, prices, contact details, or testimonials.

## Product

- Required page sequence: hero → services → about → contact form → shop → footer.
- The shop is an affiliate showcase, not a local checkout. Preserve the user's exact DOD product links including `bg_ref=VwibG78uIw` and the general affiliate link `https://dod.live/meganwalsh`.
- Display only the 3-month Daily Cleansing Tea; the user removed the other tea sizes from the shop.
- Online services are Perfect Day Consults, Mediumship Readings and Intuitive Tarot Readings. All other services are in person in Michigan and surrounding areas, as specified by the user.
- The practitioner is Megan Walsh (the user corrected the earlier spelling “Meghan”). Use Megan in all public copy and metadata. The user supplied her portrait, a celestial hero background, the infinity logo, and first-person spiritual service copy.
- Services: CellSonic Regeneration, Wolfe Non Surgical, Perfect Day Consults, Reiki Healing, Palm Readings, Intuitive Tarot Readings, Mediumship Readings, and Ordained Ministry.
- The user designated docofdetoxtreatments.com as the source for WNS, CellSonic and Perfect Day descriptions. Adapt service explanations without importing other practitioners' credentials, pricing, session duration or lifetime-support offers.
- Wolfe Non Surgical, CellSonic Regeneration and Perfect Day Consults must appear first, ahead of the spiritual services. Use an expandable description for each service.

## User preferences

- Edit the website directly in Build mode rather than using the Design canvas.
- The user rejected the initial "cotton candy" look and weak fonts. Use stronger typography and a more grounded treatment, with the supplied celestial image as the hero background.

## Gotchas

- The build-time prerender server must have its own Vite cache and no HMR listener. Sharing the live dev server's optimizer cache can invalidate React dependencies in open previews during a build.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
