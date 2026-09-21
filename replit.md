# Founder Portfolio Command Center

A private, read-only dashboard that turns the founder's Google Sheet portfolio tracker into a responsive command center.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/founder-portfolio-command-center run dev` — run the dashboard
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secrets for live data: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Source of truth: Google Sheets API, read-only in V1
- UI: React + Vite + Wouter + TanStack Query
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/founder-portfolio-command-center/src/pages/` — dashboard, portfolio, projects, waiting, beta/launch, detail, and change-log views
- `artifacts/founder-portfolio-command-center/src/components/` — shared shell and portfolio UI
- `artifacts/api-server/src/lib/portfolio.ts` — sample data, Google Sheets adapter, and session-safe fallback behavior
- `artifacts/api-server/src/routes/portfolio.ts` — read-only portfolio API
- `lib/api-spec/openapi.yaml` — API source of truth
- `README.md` — Google Sheets setup and operating instructions

## Architecture decisions

- Google Sheets remains the single source of truth; no second project database is introduced.
- Sample Mode is only used before the first successful live sync. After that, a failed refresh keeps the last successful live snapshot in memory.
- The adapter maps sheet headers by normalized name instead of fixed column letters so new rows and families appear without code changes.
- Stale status is computed for display only and never mutates a project's sheet status.

## Product

The dashboard provides live counts, family browsing, searchable/filterable project views, detailed next actions and do-not-redo guidance, waiting-on-gate triage, beta/launch grouping, lifecycle summaries, current-platform summaries, stale indicators, and newest-first change history.

## User preferences

- Mobile-first, information-dense, professional, and minimal; avoid marketing surfaces, payments, public accounts, or editing forms in V1.

## Gotchas

- Google service-account credentials must stay server-side. The browser only sees the typed portfolio snapshot.
- `GOOGLE_SHEET_ID` defaults to the requested sheet ID when the env var is absent, but credentials are still required for live mode.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
