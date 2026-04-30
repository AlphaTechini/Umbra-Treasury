# Frontend Backend Integration Plan

## Current Understanding

The frontend is a SvelteKit app in `apps/web`. The backend is a Fastify API in `apps/api`. The backend already exposes the MVP workflow endpoints, while the frontend pages are mostly built visually with static demo data, placeholder button actions, and route-local arrays.

The integration should preserve the current privacy boundary: browser wallet signing and Umbra SDK calls stay on the frontend, while the backend stores public-safe workflow records, summaries, reports, and access logs.

## Approach Chosen

Use a thin typed frontend API client under `apps/web/src/lib/api` and wire pages incrementally from highest-value demo path to lower-risk secondary screens.

This approach fits the current codebase because backend routes already own validation and response shapes, while frontend pages need a clean way to call those routes without scattering `fetch` details across every page.

## Alternatives And Tradeoffs

- Direct `fetch` calls inside each Svelte page would be faster to wire initially, but it would duplicate base URL handling, error parsing, wallet authorization payloads, and response typing.
- SvelteKit server-side proxy endpoints could hide the backend origin, but most interactions need wallet/browser context and public API calls are acceptable for this MVP.
- A generated OpenAPI client would be stronger long term, but the backend does not currently expose an OpenAPI spec and adding that now would be extra scope.

## Phase 1: Configuration And Shared API Layer

- [ ] Confirm frontend reads `PUBLIC_API_BASE_URL` from `apps/web/.env.example`.
- [ ] Create `apps/web/src/lib/api/config.ts` for public API base URL parsing.
- [ ] Create `apps/web/src/lib/api/http.ts` for shared `fetch` handling.
- [ ] Normalize backend error responses from `{ error: string }` into UI-friendly messages.
- [ ] Add request helpers for `GET`, `POST`, and `PATCH`.
- [ ] Keep secrets out of frontend code. Only `PUBLIC_*` values may reach browser code.
- [ ] Add `apps/web/src/lib/api/README.md` documenting the client boundary and file links.

## Phase 2: Wallet Session And Authorization

- [ ] Decide the first supported wallet adapter for demo flow.
- [ ] Store connected wallet address in a small frontend session store.
- [ ] Add a helper to build wallet authorization JSON messages using backend-required fields:
  - `app: "umbra-treasury-disclosure"`
  - `action`
  - `walletAddress`
  - optional `daoId`
  - optional `requestId`
  - `issuedAt`
  - `expiresAt`
- [ ] Sign authorization messages in the browser.
- [ ] Encode signatures in the base64 format expected by `apps/api/src/utils/walletAuthorization.ts`.
- [ ] Wire authorization actions:
  - `treasury_transaction:create`
  - `disclosure:review`
  - `report:mock:create`
  - `report:umbra:create`
- [ ] Show expired, rejected, and invalid signature states clearly.

## Phase 3: DAO Bootstrap Flow

- [ ] Choose a demo DAO lookup strategy:
  - fixed seeded slug for hackathon demo, or
  - create DAO on first wallet connection.
- [ ] Wire `POST /users` after wallet connection.
- [ ] Wire `POST /daos` for first DAO creation when needed.
- [ ] Wire `GET /daos/slug/:slug` for existing DAO loading.
- [ ] Persist the active DAO id in a frontend store.
- [ ] Add empty-state UI when no DAO exists yet.
- [ ] Avoid assuming a DAO id in page components without checking session state.

## Phase 4: Dashboard Integration

- [ ] Replace static KPI values in `apps/web/src/routes/dashboard/+page.svelte`.
- [ ] Call `GET /daos/:daoId/summary`.
- [ ] Map `summary.totals.income`, `summary.totals.expenses`, `summary.totals.net`, and `summary.totals.transactionCount` to KPI cards.
- [ ] Render `summary.categoryBreakdown` for category-level display.
- [ ] Show privacy note from `summary.privacy.note`.
- [ ] Add loading, error, and no-transactions states.
- [ ] Keep sensitive transaction details out of the dashboard unless they are public-safe fields.

## Phase 5: Transactions Integration

- [ ] Replace static arrays in transaction pages with backend data.
- [ ] Wire `GET /daos/:daoId/transactions`.
- [ ] Display only public-safe fields:
  - `id`
  - `type`
  - `category`
  - `token`
  - `amountHint`
  - `date`
  - `publicCounterpartyLabel`
  - `publicMemo`
  - `umbraStatus`
  - `privacyStatus`
- [ ] Keep `encryptedPrivateMetadata` out of normal table display.
- [ ] Wire `apps/web/src/routes/transactions/add/+page.svelte` to `POST /daos/:daoId/transactions`.
- [ ] Generate required wallet authorization before transaction creation.
- [ ] Map frontend categories to backend enum values:
  - Payroll -> `payroll`
  - Grants -> `grant`
  - Infrastructure -> `ops` or `vendor`, depending on final copy
  - Operations -> `ops`
- [ ] Map token selector to backend-supported token strings.
- [ ] Set `umbraOperationType` to `mock` until a real Umbra operation reference exists.
- [ ] Add success toast and redirect back to dashboard or transactions.
- [ ] Add form-level validation before sending requests.

## Phase 6: Disclosure Request Integration

- [ ] Wire `apps/web/src/routes/disclosures/request/+page.svelte` to `POST /daos/:daoId/disclosure-requests`.
- [ ] Fix enum mappings:
  - Review -> `community_review` or `internal_review`
  - Single Tx -> `single_transaction`
  - Category -> `category`
  - Date Range -> `date_range`
- [ ] Add optional scope-specific fields:
  - `transactionId`
  - `category`
  - `startDate`
  - `endDate`
- [ ] Replace static disclosure table in `apps/web/src/routes/disclosures/+page.svelte`.
- [ ] Wire `GET /daos/:daoId/disclosure-requests`.
- [ ] Wire approve/reject actions to `PATCH /daos/:daoId/disclosure-requests/:requestId/review`.
- [ ] Generate wallet authorization with action `disclosure:review`.
- [ ] Show pending, approved, rejected, and fulfilled states.
- [ ] Disable approve/reject buttons while a request is being reviewed.

## Phase 7: Reports Integration

- [ ] Wire report list pages to `GET /daos/:daoId/reports`.
- [ ] Wire report detail pages to `GET /reports/:reportId` where needed.
- [ ] Wire public summary report generation to `POST /daos/:daoId/summary-report`.
- [ ] Wire mock disclosure report generation to `POST /disclosure-requests/:requestId/mock-report`.
- [ ] Wire Umbra compliance report ingestion to `POST /disclosure-requests/:requestId/umbra-report`.
- [ ] Generate wallet authorization for report creation:
  - `report:mock:create`
  - `report:umbra:create`
- [ ] Display report source clearly:
  - `summary_only`
  - `umbra_compliance`
  - `mock`
- [ ] Display verification status clearly and never mark frontend-submitted Umbra reports as verified.
- [ ] Keep mock output labeled as mock/demo data.

## Phase 8: Umbra Frontend Flow

- [ ] Use existing helpers in `apps/web/src/lib/umbra`.
- [ ] Wire Umbra client creation after wallet connection.
- [ ] Add register user flow with Umbra SDK.
- [ ] Add encrypted balance deposit flow.
- [ ] Add encrypted balance query flow.
- [ ] Add encrypted balance withdrawal flow.
- [ ] For compliance disclosure, issue grant in the browser and send only grant references to the backend.
- [ ] Do not send viewing keys or private key material to the backend.
- [ ] Keep mixer/indexer/relayer work out of first integration unless judging requires it.

## Phase 9: Access Logs

- [ ] Wire `GET /daos/:daoId/access-logs`.
- [ ] Add an audit/activity panel to dashboard or disclosures page.
- [ ] Display actions:
  - `dao_created`
  - `transaction_added`
  - `disclosure_requested`
  - `disclosure_approved`
  - `disclosure_rejected`
  - `compliance_grant_issued`
  - `report_generated`
  - `mock_disclosure_generated`
- [ ] Show timestamps and actor labels without exposing sensitive details.

## Phase 10: UI State Cleanup

- [ ] Replace placeholder toasts that claim successful work when no backend call happened.
- [ ] Replace hardcoded chart randomness with stable backend-derived data or deterministic placeholders.
- [ ] Add loading states for each backend call.
- [ ] Add empty states for no transactions, no disclosures, no reports, and no access logs.
- [ ] Add disabled states during wallet signing and network requests.
- [ ] Add retry affordances for failed reads.
- [ ] Audit contrast after wiring disabled, error, success, warning, and hover states.

## Phase 11: Non-Functional Symbols And Buttons To Review

Ask before removing any of these, because some may be intended as future affordances:

- [ ] Header notification icon buttons on dashboard/disclosures.
- [ ] Header settings icon buttons on dashboard/disclosures.
- [ ] Dashboard search field if no search behavior will be implemented.
- [ ] Dashboard All/Pending/Revealed segmented filter if not wired.
- [ ] Disclosure Pending/Resolved/Rejected segmented filter if not wired.
- [ ] Transaction export CSV button if export is not planned.
- [ ] Transaction row options menu button if no menu is planned.
- [ ] Transaction sort icon button if sorting is not planned.
- [ ] Reports share button if sharing is not planned.
- [ ] Reports chart expand button if no expanded chart view is planned.
- [ ] Reports generated archive download icons if downloads are not planned.
- [ ] Reveal transaction copy icon if clipboard copying is not planned.
- [ ] Connect wallet help button if no help modal/page is planned.

## Phase 12: Verification Checklist

- [ ] Run `pnpm build:api`.
- [ ] Run `pnpm check:web`.
- [ ] Run `pnpm build:web`.
- [ ] Start backend with `pnpm dev:api`.
- [ ] Start frontend with `pnpm dev:web`.
- [ ] Verify CORS allows `http://localhost:5173`.
- [ ] Verify dashboard loads summary from backend.
- [ ] Verify transaction creation requires wallet authorization.
- [ ] Verify disclosure approval/rejection requires wallet authorization.
- [ ] Verify mock report generation requires wallet authorization.
- [ ] Verify Umbra report ingestion stores source `umbra_compliance` and verification `unverified`.
- [ ] Verify `.env` remains ignored and secrets are not committed.

## Suggested Integration Order

1. Shared API client and env parsing.
2. Wallet session and authorization helper.
3. DAO bootstrap.
4. Dashboard summary read.
5. Transaction list and creation.
6. Disclosure request submit/list/review.
7. Report list and generation.
8. Access log display.
9. Umbra real-flow wiring.
10. Remove or wire placeholder UI symbols.

