# Schema - Umbra Treasury Disclosure

## Overview

This schema supports a private DAO treasury disclosure system where:

- Wallets are used for authentication.
- DAO owners manage private treasury workspaces.
- Treasury records store workflow metadata and Umbra operation references.
- Public users see aggregate summaries only.
- Auditors and reviewers request scoped disclosure.
- Reports are generated from summary data, Umbra compliance disclosure, or clearly marked mock data.
- Access logs track accountability events.

The database must not become the source of private financial truth. Umbra remains the privacy and disclosure layer.

---

# Core Principle

The schema should model Umbra's real primitives, not a generic `viewingKey -> revealTransaction` shortcut.

Umbra concepts that affect this schema:

- Encrypted Balances hide SPL and Token-2022 balances.
- Mixer / UTXO flows can hide links between source and destination activity.
- Compliance uses hierarchical viewing keys and X25519 compliance grants.
- UTXO scanning depends on the Umbra indexer.
- Claim operations depend on a relayer.
- ZK prover dependencies must be supplied explicitly by the application.

The product can still use the phrase "selective disclosure," but implementation should map disclosure to Umbra's actual compliance model.

---

# Core Entities

## 1. users

Represents a wallet-authenticated user.

```ts
type User = {
  id: string
  walletAddress: string
  username?: string
  createdAt: Date
  updatedAt: Date
}
```

### Notes

- `walletAddress` is the primary identity.
- Email/password auth is not needed for MVP.
- One user can own multiple DAO workspaces.
- The app must never store wallet private keys.

---

## 2. daos

Represents a DAO treasury workspace.

```ts
type DAO = {
  id: string
  ownerId: string
  name: string
  slug: string
  treasuryAddress?: string
  baseToken: "USDC" | "USDT" | "WSOL" | "UMBRA" | "OTHER"
  description?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Relationships

```txt
User 1 -> many DAOs
DAO 1 -> many TreasuryTransactions
DAO 1 -> many DisclosureRequests
DAO 1 -> many Reports
DAO 1 -> many AccessLogs
```

---

## 3. treasury_transactions

Represents a DAO treasury activity record. This table stores public-safe workflow metadata and references to Umbra operations, not raw private financial truth.

```ts
type TreasuryTransaction = {
  id: string
  daoId: string

  type: "income" | "expense" | "transfer"
  category:
    | "grant"
    | "payroll"
    | "vendor"
    | "ops"
    | "tax"
    | "treasury_transfer"
    | "other"

  token: string
  amountHint?: string
  date: Date

  publicCounterpartyLabel?: string
  publicMemo?: string
  encryptedPrivateMetadata?: string

  umbraOperationType:
    | "registration"
    | "deposit"
    | "withdraw"
    | "utxo_create"
    | "utxo_claim"
    | "compliance_grant"
    | "compliance_revoke"
    | "mock"

  umbraOperationRefs: Record<string, unknown>

  umbraStatus: "not_started" | "pending" | "confirmed" | "failed"
  privacyStatus: "private" | "summary_included" | "disclosure_available"

  createdById: string
  createdAt: Date
  updatedAt: Date
}
```

### Required Fields

- `umbraOperationType` is required because Umbra actions are not all represented by a single transaction signature.
- `umbraOperationRefs` is required as flexible JSON because different Umbra actions produce different references.
- `privacyStatus` is required, but it must not imply global public reveal.

### Optional Fields

- `amountHint` is optional and should never be treated as canonical private financial truth.
- `publicCounterpartyLabel` is optional because counterparty labels can leak sensitive information.
- `publicMemo` is optional for the same reason.
- `encryptedPrivateMetadata` is optional for MVP, but it is the better production path for private notes and labels.

### Umbra Operation Reference Examples

For deposits or withdrawals:

```ts
type DirectOperationRefs = {
  queueSignature?: string
  callbackSignature?: string
}
```

For UTXO or mixer operations:

```ts
type UtxoOperationRefs = {
  treeIndex?: number
  insertionIndex?: number
  relayerRequestId?: string
  queueSignature?: string
  callbackSignature?: string
}
```

For compliance operations:

```ts
type ComplianceOperationRefs = {
  grantSignature?: string
  revokeSignature?: string
  grantAccount?: string
  reportId?: string
}
```

---

## 4. disclosure_requests

Represents a request to view scoped treasury details.

```ts
type DisclosureRequest = {
  id: string
  daoId: string

  requesterName: string
  requesterOrganization?: string
  requesterContact?: string

  reason:
    | "audit"
    | "tax"
    | "grant_review"
    | "community_review"
    | "internal_review"
    | "other"

  message?: string

  requestedScope: "single_transaction" | "category" | "date_range" | "full_report"

  transactionId?: string
  category?: string
  startDate?: Date
  endDate?: Date

  disclosureMethod?: "viewing_key" | "x25519_grant" | "mock"
  status: "pending" | "approved" | "rejected" | "fulfilled"

  fulfilledReportId?: string
  reviewedById?: string
  reviewedAt?: Date

  createdAt: Date
  updatedAt: Date
}
```

### Required Fields

- `requestedScope` is required because every request must be scoped.
- `status` is required because the owner workflow depends on it.

### Optional Fields

- `disclosureMethod` is optional while pending because the owner may choose the method during approval.
- `fulfilledReportId` is optional because pending and rejected requests do not produce reports.
- `transactionId`, `category`, `startDate`, and `endDate` are scope-specific.

### Notes

This creates the accountability workflow:

```txt
Viewer requests -> DAO owner reviews -> Umbra compliance disclosure or mock fallback -> report generated -> access logged
```

---

## 5. reports

Represents generated disclosure artifacts.

Reports are the MVP home for revealed or summarized output. This avoids creating another table full of sensitive data before the project needs one.

```ts
type Report = {
  id: string
  daoId: string
  disclosureRequestId?: string

  type: "public_summary" | "auditor_report" | "tax_estimate"
  source: "summary_only" | "umbra_compliance" | "mock"
  verificationStatus: "unverified" | "verified" | "failed"

  title: string
  startDate?: Date
  endDate?: Date

  generatedById?: string
  generatedAt: Date

  reportData: Record<string, unknown>
}
```

### Required Fields

- `source` is required so `mock`, `summary_only`, and `umbra_compliance` reports are never confused.
- `verificationStatus` is required so reports do not imply verification that has not happened.
- `reportData` is required because the report is the disclosure artifact.

### Report Types

#### public_summary

Contains only generated aggregate data:

```ts
type PublicSummaryReportData = {
  totalIncome?: string
  totalExpenses?: string
  netFlow?: string
  categoryTotals: Record<string, string>
  transactionCount: number
  source: "summary_only"
}
```

Public summaries must not imply that every private transaction amount is stored in plaintext. They should be generated from intentionally public-safe metadata, approved snapshots, mock data, or Umbra-backed aggregate logic.

#### auditor_report

Contains scoped details only after approval:

```ts
type AuditorReportData = {
  source: "umbra_compliance" | "mock"
  disclosureMethod: "viewing_key" | "x25519_grant" | "mock"
  transactions: Array<{
    operationRefs: Record<string, unknown>
    amount?: string
    token: string
    category: string
    publicCounterpartyLabel?: string
    publicMemo?: string
    date: string
    verificationStatus: "verified" | "failed" | "unverified"
  }>
}
```

#### tax_estimate

Contains a simple estimate from approved or mock report data:

```ts
type TaxEstimateReportData = {
  source: "umbra_compliance" | "mock"
  totalIncome: string
  deductibleExpenses: string
  taxableAmount: string
  taxRate: number
  estimatedTax: string
}
```

Tax estimates are not full tax compliance.

---

## 6. access_logs

Tracks important disclosure and report actions.

```ts
type AccessLog = {
  id: string
  daoId: string

  actorId?: string
  actorLabel?: string

  action:
    | "dao_created"
    | "transaction_added"
    | "disclosure_requested"
    | "disclosure_approved"
    | "disclosure_rejected"
    | "compliance_grant_issued"
    | "compliance_grant_revoked"
    | "report_generated"
    | "mock_disclosure_generated"

  targetType:
    | "dao"
    | "transaction"
    | "disclosure_request"
    | "report"
    | "umbra_operation"

  targetId: string
  metadata?: Record<string, unknown>

  createdAt: Date
}
```

### Notes

Auditors care about:

```txt
who requested access
who approved access
what scope was disclosed
which method was used
when it happened
why it happened
```

---

# Optional Later Entity: compliance_disclosures

Do not add this table for the MVP unless `reports.reportData` becomes too messy or the app needs repeated access to structured disclosed records.

If needed later, prefer `compliance_disclosures` over `revealed_transactions` because the table represents scoped disclosure artifacts, not global transaction revelation.

```ts
type ComplianceDisclosure = {
  id: string
  daoId: string
  transactionId?: string
  disclosureRequestId?: string
  reportId?: string

  method: "viewing_key" | "x25519_grant" | "mock"
  source: "umbra_compliance" | "mock"
  verificationStatus: "verified" | "failed" | "unverified"

  disclosedData: Record<string, unknown>
  disclosedById: string
  disclosedAt: Date
}
```

### Why Optional

This table would store sensitive disclosed output. For MVP, keeping disclosed output inside reports reduces schema surface area and makes it clearer that disclosure is report-scoped.

---

# Minimal Relational Model

```txt
users
  id PK
  wallet_address UNIQUE
  username
  created_at
  updated_at

daos
  id PK
  owner_id FK -> users.id
  name
  slug UNIQUE
  treasury_address
  base_token
  description
  is_public
  created_at
  updated_at

treasury_transactions
  id PK
  dao_id FK -> daos.id
  type
  category
  token
  amount_hint
  date
  public_counterparty_label
  public_memo
  encrypted_private_metadata
  umbra_operation_type
  umbra_operation_refs JSONB
  umbra_status
  privacy_status
  created_by_id FK -> users.id
  created_at
  updated_at

disclosure_requests
  id PK
  dao_id FK -> daos.id
  requester_name
  requester_organization
  requester_contact
  reason
  message
  requested_scope
  transaction_id FK -> treasury_transactions.id NULL
  category
  start_date
  end_date
  disclosure_method
  status
  fulfilled_report_id FK -> reports.id NULL
  reviewed_by_id FK -> users.id NULL
  reviewed_at
  created_at
  updated_at

reports
  id PK
  dao_id FK -> daos.id
  disclosure_request_id FK -> disclosure_requests.id NULL
  type
  source
  verification_status
  title
  start_date
  end_date
  generated_by_id FK -> users.id NULL
  generated_at
  report_data JSONB

access_logs
  id PK
  dao_id FK -> daos.id
  actor_id FK -> users.id NULL
  actor_label
  action
  target_type
  target_id
  metadata JSONB
  created_at
```

---

# MVP Simplification

For the first build, use only:

```txt
users
daos
treasury_transactions
disclosure_requests
reports
access_logs
```

Do not build `compliance_disclosures` in the first pass.

Store approved disclosure output inside `reports.reportData` for MVP speed, with clear `source` and `verificationStatus` fields.

---

# Privacy Rules

## Rule 1

Do not treat frontend hiding as privacy.

## Rule 2

Do not store wallet private keys, Umbra private keys, or raw viewing-key material.

## Rule 3

Do not store raw private financial details as the database source of truth.

## Rule 4

Reports must clearly show whether data is:

```txt
summary_only
umbra_compliance
mock
```

## Rule 5

Compliance disclosure must be an intentional owner action, not automatic background behavior.

## Rule 6

Plaintext labels and memos are not automatically safe. Treat counterparty labels, private notes, and payroll/vendor context as potentially sensitive.

---

# Recommended Stack Mapping

## PostgreSQL

Use for:

- users
- daos
- transaction metadata
- disclosure requests
- reports
- access logs

## JSONB

Use for:

- Umbra operation references
- report data
- flexible access-log metadata
- clearly marked mock reveal payloads

## Redis / Queue

Not needed for MVP.

---

# Build Priority

## Phase 1

- User wallet auth
- DAO creation
- Add treasury transaction metadata
- Public-safe summary report

## Phase 2

- Disclosure request flow
- Owner approval/rejection
- Access logs

## Phase 3

- Umbra client setup
- Registration
- Deposit/query/withdraw flow
- Umbra-aligned compliance disclosure path
- Auditor and tax-style report generation

## Phase 4

- Optional mixer/UTXO path if judging or demo requirements need it
- Export report as JSON/CSV/PDF if time remains
- Better dashboard polish
