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

- Enquiries are stored, not emailed. Do not imply the practitioner is notified until an actual notification flow is connected.
- Do not collect sensitive health information in the public form.
- Do not invent practitioner credentials, health outcomes, prices, contact details, or testimonials.

## Product

- Required page sequence: hero → services → about → contact form → footer.
- The user supplied the pastel infinity logo and named CellSonic Regeneration, Wolfe Non Surgical, and Perfect Day Consults.
- Additional services and service details will be provided by the user. Practitioner biography is also pending; placeholder copy must stay identifiable.

## User preferences

- Edit the website directly in Build mode rather than using the Design canvas.
- Use the supplied logo's pastel pink, lilac, and blue direction on a light background.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
