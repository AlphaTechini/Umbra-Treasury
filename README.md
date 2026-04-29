# Umbra Treasury Disclosure

## The Problem

Blockchains are transparent by default.

That sounds good until an actual organization needs to run payroll, pay vendors, manage grants, or negotiate treasury strategy on-chain.

For DAOs and on-chain teams, full transparency creates real problems:

- Salaries are publicly visible.
- Vendor payments weaken negotiation privacy.
- Grants and treasury strategy become trackable.
- Wallets reveal financial behavior and security patterns.

Full privacy creates the opposite problem:

- No visibility means no accountability.
- No accountability means less trust.

So DAO treasuries are stuck between:

```txt
Full transparency -> harmful exposure
Full privacy -> weak accountability
```

---

## The Solution

Umbra Treasury Disclosure introduces:

> Private-by-default treasury activity with selective transparency on demand.

Using Umbra's privacy infrastructure, sensitive treasury activity can remain protected while DAO owners still produce scoped disclosure reports for auditors, contributors, reviewers, or public stakeholders.

When accountability is required, DAO owners can:

- approve or reject disclosure requests
- use Umbra-aligned compliance disclosure
- generate source-labeled reports
- provide tax-style summaries
- share scoped financial insight without exposing the full treasury history

---

## What This Project Does

Umbra Treasury Disclosure allows DAOs to:

### 1. Record Private Treasury Activity

- Treasury records reference Umbra operations.
- The app stores workflow metadata and protocol references.
- Sensitive financial truth should remain outside normal plaintext database fields.

### 2. Provide Public Transparency Without Exposure

Public users can view:

- total income
- total expenses
- category-level breakdowns
- transaction counts
- report source and verification status

Individual private details remain hidden unless disclosed through an approved flow.

### 3. Enable Disclosure Requests

- Auditors, contributors, or stakeholders can request scoped access.
- DAO owners control whether a request is approved or rejected.
- Access logs track who requested access, what scope was requested, and what action was taken.

### 4. Use Umbra's Actual Compliance Model

Disclosure should map to Umbra's real primitives:

- encrypted balances
- optional mixer / UTXO flows
- hierarchical viewing keys
- X25519 compliance grants
- indexer and relayer dependencies when needed

The project should not pretend disclosure is a generic one-call decrypt operation.

### 5. Generate Reports

Reports must clearly identify their source:

- `summary_only`
- `umbra_compliance`
- `mock`

Report types:

- public summary reports
- auditor/compliance reports
- simple tax-style estimates

---

## Why This Works

This system solves the core contradiction in Web3 finance:

> How can a DAO stay private and still be accountable?

The answer:

- Keep sensitive treasury activity private at the protocol layer with Umbra.
- Store only workflow metadata, public-safe labels, and operation references in the app.
- Reveal only scoped information through intentional, logged disclosure flows.

Unlike traditional permission-only systems, this project does not treat frontend hiding as privacy.

---

## Why Umbra Is Essential

Without Umbra:

- Sensitive data may live in plain database fields.
- Access control is mostly backend logic.
- Admin access or a leak can expose everything.

With Umbra:

- Balances can be encrypted at the protocol layer.
- Mixer / UTXO flows can reduce linkability when used.
- Compliance disclosure can be scoped through Umbra's actual model.
- The app can focus on workflow, reporting, and accountability.

Umbra is not an add-on. It is the foundation of the system.

---

## Key Features

- Private treasury transaction tracking
- Umbra operation reference tracking
- Public summary dashboards
- Disclosure request workflow
- Umbra-aligned compliance disclosure
- Auditor and compliance reporting
- Simple tax-style estimation
- Access logging for accountability
- Clearly labeled mock mode for demo fallback

---

## User Roles

### DAO Owner

- Creates treasury workspace
- Adds treasury activity metadata
- Connects wallet and uses Umbra operations
- Approves or rejects disclosure requests
- Generates reports

### Public Viewer

- Views DAO public summary
- Requests disclosure when needed

### Auditor / Reviewer

- Requests scoped access
- Receives source-labeled disclosure reports

---

## Core Flow

```txt
Umbra-protected treasury activity
        ->
App stores workflow metadata and operation refs
        ->
Public sees summary only
        ->
Disclosure request submitted
        ->
DAO owner approves or rejects
        ->
Umbra-aligned compliance disclosure or labeled mock fallback
        ->
Report generated and access logged
```

---

## Tech Stack

- Frontend: SvelteKit + Tailwind
- Backend: Fastify (Node.js)
- Database: PostgreSQL (Drizzle ORM)
- Wallet Auth: Solana Wallet Adapter
- Privacy Layer: Umbra SDK
- Package Manager: pnpm

---

## Project Structure

See [structure.md](./structure.md) for the current folder and logic map.

Backend implementation:

- [apps/api](./apps/api) contains the Fastify backend.
- [apps/web](./apps/web) contains the SvelteKit frontend.
- [apps/api/src/routes](./apps/api/src/routes) exposes the current HTTP API surface.
- [apps/api/src/services](./apps/api/src/services) coordinates workflow logic.
- [apps/api/src/providers](./apps/api/src/providers) contains the Umbra provider boundary and mock fallback.

Core planning docs:

- [Schema.md](./Schema.md) explains the data model and MVP persistence boundaries.
- [Umbra.md](./Umbra.md) explains the Umbra integration strategy.
- [Userflow.md](./Userflow.md) explains the product flows.
- [Resources.md](./Resources.md) lists the Umbra resources used for implementation.
- [.agents/GUIDE.md](./.agents/GUIDE.md) stores agreed implementation memory.

---

## Demo Flow

1. Connect wallet.
2. Create DAO treasury.
3. Register or prepare Umbra account flow.
4. Add private treasury activity metadata.
5. View public summary with no sensitive transaction details.
6. Submit disclosure request.
7. Approve request as owner.
8. Use Umbra-aligned compliance disclosure or clearly labeled mock fallback.
9. Generate auditor and tax-style reports.
10. Show the access log trail.

## Backend API Status

The backend now exposes the first MVP vertical slice:

- user creation and lookup by wallet address
- DAO creation and lookup by slug
- treasury transaction metadata creation and listing
- public DAO summary generation
- disclosure request submission and owner review
- mock/source-labeled report generation
- DAO report listing and report lookup
- access log listing

Run the backend with:

```powershell
pnpm install
$env:DATABASE_URL="postgresql://user:password@localhost:5432/umbra_treasury?schema=public&sslmode=require"
pnpm db:migrate
pnpm dev:api
pnpm dev:web
```

---

## Design Principles

- Private by default.
- Transparent when necessary.
- Minimal trust in backend-held sensitive data.
- Clear separation of roles.
- Reports must identify data source and verification status.
- Mock mode must never be confused with real Umbra-backed verification.

---

## What This Is Not

- Not a DAO governance platform.
- Not a full accounting system.
- Not a payroll SaaS.
- Not a tax compliance engine.

It is:

> A privacy-first treasury disclosure layer.

---

## Future Improvements

- Deeper real Umbra compliance integration
- Encrypted private metadata
- Optional mixer / UTXO path
- Multi-sig DAO ownership
- Role-based access control
- Advanced tax/reporting logic
- Export formats such as PDF and CSV
- On-chain verification proofs

---

## Final Thought

Web3 made finance transparent.

Real organizations need privacy.

Umbra Treasury Disclosure bridges that gap:

> Private where it matters. Transparent where it counts.
