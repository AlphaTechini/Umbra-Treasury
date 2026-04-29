# Project Guide - Umbra Treasury Disclosure

## Confirmed Product Direction

Umbra Treasury Disclosure is a privacy-first DAO treasury disclosure app.

The product goal is to let DAO treasury activity remain private by default while still allowing scoped transparency for auditors, contributors, reviewers, and public stakeholders.

The core demo should prove:

- DAO treasury activity can be private by default.
- Public viewers can see aggregate summaries without sensitive transaction details.
- Reviewers can request scoped disclosure.
- DAO owners can approve, reject, and generate reports from approved disclosure flows.
- Every disclosure action should be logged for accountability.

## Umbra Integration Decision

Use Umbra's actual model instead of a generic or invented "viewing key reveal" abstraction.

Important Umbra primitives to align with:

- Encrypted Balances hide SPL and Token-2022 token balances.
- Mixer / UTXO flows hide links between source and destination activity.
- Compliance support uses hierarchical viewing keys and X25519 compliance grants.
- UTXO scanning depends on the Umbra indexer.
- Claim operations depend on a relayer.
- ZK prover dependencies must be supplied explicitly.

The product language can still say "selective disclosure," but implementation should map that idea to Umbra's real compliance model.

## Umbra SDK Notes

Primary SDK package:

- `@umbra-privacy/sdk`

Known SDK constraints from the Umbra LLM docs:

- Runtime: Node.js 18+ or modern browser with BigInt support.
- TypeScript 5.0+ is required.
- Wallets must implement `IUmbraSigner`.
- RPC needs HTTP and WebSocket endpoints.
- Amounts use token base units as branded `U64` bigint values.
- No client-level default commitment; functions accept per-call commitment options.
- ZK provers are not defaulted and must be passed explicitly.
- Supported mainnet tokens include USDC, USDT, wSOL, and UMBRA.

Useful Umbra docs:

- `https://sdk.umbraprivacy.com/llms.txt`
- `https://sdk.umbraprivacy.com/llms-full.txt`
- `https://sdk.umbraprivacy.com/concepts/how-umbra-works`
- `https://sdk.umbraprivacy.com/reference/client`
- `https://sdk.umbraprivacy.com/reference/compliance`
- `https://sdk.umbraprivacy.com/reference/errors`

## Architecture Decisions

Use a provider boundary around Umbra integration.

Preferred shape:

- `RealUmbraProvider` wraps actual Umbra SDK calls.
- `MockUmbraProvider` exists only as a clearly labeled demo fallback.
- UI and generated reports must clearly mark mock output as demo/mock data.

This keeps product workflow code separate from protocol-specific calls and protects the demo from SDK or network issues without pretending mock privacy is real privacy.

Backend implementation now lives in `apps/api` as a Fastify workspace.

Frontend implementation now lives in `apps/web` as a SvelteKit workspace imported from `https://github.com/AlphaTechini/Umbra-Treasury-frontend-`.

Current backend structure:

- routes own HTTP request validation and response shape.
- services own workflow decisions and access-log coordination.
- repositories own Drizzle queries.
- providers own the Umbra integration boundary.
- config owns environment parsing.
- real frontend-issued Umbra compliance grants are recorded through `POST /disclosure-requests/:requestId/umbra-report`.

Current frontend structure:

- routes own pages and SvelteKit server endpoints.
- lib owns shared helpers, loading state, toasts, and reusable components.
- `apps/web/src/lib/umbra` owns route-agnostic Umbra SDK client/session helpers, encrypted balance operations, and compliance grant helpers.
- SvelteKit uses `@sveltejs/adapter-vercel`.
- Gemini insight generation must read `GEMINI_API_KEY` through SvelteKit private environment access only.

Drizzle is the backend ORM. The schema lives in `apps/api/src/db/schema.ts`, migrations live in `migrations`, and `drizzle.config.ts` controls migration tooling.

The backend Dockerfile uses a multi-stage build and does not require database credentials during image build.

## MVP Scope

Build the MVP around these entities:

- users
- daos
- treasury_transactions
- disclosure_requests
- reports
- access_logs

Do not add `revealed_transactions` for the first build. For MVP speed, approved disclosure output should live inside `reports.reportData` as long as reports clearly identify whether the source is `summary_only`, `umbra_compliance`, or `mock`.

## Privacy Rules

Do not treat frontend hiding as privacy.

Do not store viewing keys.

Do not store raw private financial details as the database source of truth.

Compliance disclosure actions must be intentional owner actions, not automatic background behavior.

Reports must identify their data source:

- `summary_only`
- `umbra_compliance`
- `mock`

## Schema Decisions

Use `reports` as the MVP disclosure artifact. Do not add `revealed_transactions` in the first pass.

Use `umbraOperationType` and `umbraOperationRefs` on treasury records instead of a single `umbraTxSignature`.

Use report source values that map to the schema:

- `summary_only`
- `umbra_compliance`
- `mock`

Use report verification values:

- `unverified`
- `verified`
- `failed`

Treat `publicCounterpartyLabel` and `publicMemo` as optional because labels and memos can leak sensitive payroll, vendor, grant, or negotiation details.

Use `encryptedPrivateMetadata` later for private notes and labels when the project needs production-grade private metadata handling.

## Implementation Priorities

Initial real Umbra focus:

- create Umbra client
- register user
- deposit public token balance into encrypted balance
- query encrypted balance
- withdraw from encrypted balance
- implement compliance disclosure using Umbra's actual compliance primitives

Backend real-compliance report ingestion now records frontend-issued Umbra grant references as `reports.source = "umbra_compliance"` and writes both `compliance_grant_issued` and `report_generated` access logs.

Frontend Umbra SDK integration now starts in `apps/web/src/lib/umbra` and intentionally avoids route-page wiring until the pages are ready.

Required public frontend env values for real Umbra client creation:

- `PUBLIC_UMBRA_NETWORK`
- `PUBLIC_UMBRA_RPC_HTTP_URL`
- `PUBLIC_UMBRA_RPC_WS_URL`
- `PUBLIC_UMBRA_INDEXER_URL` when mixer/indexer features are used

Treat full mixer usage as later unless judging requirements demand it. Mixer integration adds indexer, relayer, and ZK prover complexity.

## Stack Defaults

Frontend:

- SvelteKit
- Tailwind CSS
- `@sveltejs/adapter-vercel`

Backend:

- Fastify on Node.js unless a Go backend is explicitly chosen later.
- Drizzle ORM with PostgreSQL.
- Backend Dockerfile only.
- No Docker Compose unless explicitly requested.

Package manager:

- pnpm

## Demo Flow

The core demo path should be:

1. Connect wallet.
2. Create DAO treasury.
3. Register with Umbra.
4. Add private treasury transaction metadata.
5. Show public aggregate summary.
6. Submit disclosure request.
7. Owner approves request.
8. Use Umbra-aligned compliance disclosure flow.
9. Generate auditor and tax-style reports.
10. Show access log trail.

## Out Of Scope For MVP

Avoid building:

- DAO governance
- voting
- full payroll system
- full accounting system
- advanced tax compliance
- complex role-based access control
- PDF export unless time remains
- Docker Compose

## Open Questions To Resolve During Implementation

- Whether the hackathon judging expects direct mixer usage or whether encrypted balances plus compliance disclosure is sufficient.
- Whether the first demo should run on devnet or use mock mode first with a clear path to devnet.
- How much of the compliance flow can be completed in the frontend versus backend without weakening privacy.
- Which report fields should be considered sensitive and excluded from database storage.
