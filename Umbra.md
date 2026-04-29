# Umbra Integration - Why It Is Crucial

## Overview

Umbra Treasury Disclosure is not just hiding fields in a Web2 dashboard.

Umbra is the privacy layer that lets DAO treasury activity remain confidential while still allowing scoped disclosure when accountability is required.

The core idea:

> Public users can see approved summaries and disclosure outcomes, but sensitive treasury details stay protected unless the DAO intentionally uses Umbra-aligned compliance disclosure.

---

## Why Umbra Is Needed

A normal Web2 app can hide data with permissions.

That is not enough for this project.

In a normal app:

- The database may still contain readable sensitive data.
- The backend can expose it.
- Admins can access it.
- A leak can expose everything.

With Umbra:

- Sensitive balances can be encrypted at the protocol layer.
- Mixer / UTXO flows can reduce linkability between source and destination activity.
- Compliance disclosure can use Umbra's actual primitives, including hierarchical viewing keys and X25519 compliance grants.
- The app can store workflow metadata without becoming the source of private financial truth.

Umbra is essential, not decorative.

---

## What Umbra Protects

Umbra can protect the sensitive treasury layer:

- Private token balances through encrypted balances.
- Private movement patterns through mixer / UTXO flows when used.
- Scoped disclosure through compliance tooling.
- Protocol-level references that can be verified without exposing every detail publicly.

The app should not rely on UI hiding as its privacy model.

---

## What The App Stores

The app stores workflow and reporting metadata:

- DAO name
- DAO owner wallet
- Treasury label
- Transaction category
- Public-safe labels and memos
- Umbra operation type
- Umbra operation references
- Disclosure request status
- Report source and verification status
- Access logs

The app should avoid storing raw sensitive financial details as the source of truth.

Plaintext counterparty labels and memos are not automatically safe. If a label or memo reveals vendor, payroll, grant, or negotiation information, it should be treated as sensitive.

---

## Core Integration Points

### 1. Wallet Connection

Users connect a Solana wallet.

The connected wallet is used as the DAO owner identity.

Flow:

```txt
Connect wallet
Sign auth message
Create authenticated session
Assign wallet as DAO owner
```

Umbra SDK usage also requires a signer compatible with `IUmbraSigner`.

---

### 2. Umbra Client Setup

The app creates an Umbra client using:

- Solana signer
- Network
- RPC HTTP endpoint
- RPC WebSocket endpoint
- Indexer endpoint when UTXO scanning is needed

The client should be created through a provider boundary so product workflow code does not directly depend on every SDK detail.

Preferred provider shape:

```ts
interface UmbraPrivacyProvider {
  registerUser(input: RegisterUserInput): Promise<RegisterUserResult>
  deposit(input: DepositInput): Promise<DepositResult>
  withdraw(input: WithdrawInput): Promise<WithdrawResult>
  queryBalance(input: QueryBalanceInput): Promise<QueryBalanceResult>
  issueComplianceDisclosure(input: ComplianceDisclosureInput): Promise<ComplianceDisclosureResult>
}
```

---

### 3. Private Treasury Activity

When a DAO records treasury activity, the sensitive movement should be represented through Umbra where possible.

Flow:

```txt
DAO owner creates treasury action
Umbra handles encrypted balance, withdrawal, deposit, UTXO, or compliance operation
App stores operation references and public-safe metadata
Private financial truth remains outside normal database fields
```

Stored Umbra references should be flexible:

```txt
umbraOperationType
umbraOperationRefs
umbraStatus
```

Examples of operation refs:

```txt
queueSignature
callbackSignature
treeIndex
insertionIndex
relayerRequestId
grantSignature
grantAccount
```

---

### 4. Public Treasury View

Public users can view DAO treasury summaries.

They can see:

```txt
Total income
Total expenses
Category totals
Transaction count
Reporting period
Report source
Verification status
```

They should not see:

```txt
Private recipients
Private memos
Raw private amounts
Compliance key material
Full transaction breakdown
```

Public summaries must clearly identify their source:

```txt
summary_only
umbra_compliance
mock
```

---

### 5. Disclosure Request

A public viewer, DAO member, accountant, or auditor can request disclosure.

Request fields:

```txt
Requester name
Organization
Reason
Requested scope
Requested date range
Requested category
Requested transaction
Message
```

This creates a pending request for the DAO owner.

Disclosure scopes:

```txt
single_transaction
category
date_range
full_report
```

---

### 6. Umbra-Aligned Disclosure

The owner approves a request and chooses how to fulfill it.

Supported disclosure methods:

```txt
viewing_key
x25519_grant
mock
```

Important:

- Use Umbra's actual compliance model.
- Do not store raw viewing-key material.
- Do not describe disclosure as one generic decrypt function.
- Make mock disclosure visibly labeled in the UI and report output.

Flow:

```txt
Owner approves request
Owner chooses disclosure method
App performs Umbra compliance flow or clearly marked mock fallback
Report is generated with source and verification status
Access log records scope, method, and target report
```

---

## Why Compliance Disclosure Matters

Selective transparency is the product's main value.

Without scoped disclosure:

- Everything is public, which destroys treasury privacy.
- Or everything is hidden, which destroys accountability.

With Umbra-aligned compliance:

- DAO treasury activity can remain private by default.
- Auditors can receive scoped reports.
- Community members can see public summaries.
- Sensitive details are revealed only through intentional, logged actions.

---

## Report Generation

Reports should be generated from approved sources, not fake database fields.

### Public Summary Report

Uses public-safe aggregate data.

```txt
Payroll: aggregate only
Grants: aggregate only
Vendors: aggregate only
Ops: aggregate only
```

No sensitive transaction-level details should appear in a public summary.

### Auditor Report

Requires owner approval and Umbra-aligned disclosure or clearly marked mock mode.

```txt
Umbra operation references
Amount if disclosed
Token
Category
Approved public-safe labels
Date
Disclosure reason
Source
Verification status
```

### Tax Estimate Report

Uses approved report data.

```txt
Total income
Deductible expenses
Taxable amount
Tax rate
Estimated tax
Source
Verification status
```

Tax logic remains simple and manually configured for MVP.

---

## Fallback Demo Mode

The app should include a clean abstraction for demo safety.

Use two providers:

```txt
RealUmbraProvider -> actual SDK integration
MockUmbraProvider -> clearly labeled demo fallback
```

The UI and reports must clearly show when mock mode is active.

Mock mode should preserve the product flow without claiming real privacy or real verification.

---

## Crucial Rule

Bad version:

```txt
App stores private financial truth
Owner clicks reveal
UI decides who can see it
```

Good version:

```txt
Umbra protects the sensitive layer
App stores workflow metadata and operation refs
Owner performs intentional compliance disclosure
Report records source and verification status
```

---

## Judging Alignment

This integration supports the track criteria:

### Core Integration

Umbra is required to protect private treasury activity and support scoped disclosure.

### Innovation

The app turns private treasury activity into usable DAO compliance workflows.

### Product Potential

DAOs need privacy for salaries, vendors, grants, and negotiations while still keeping accountability.

### Impact

The app solves the conflict between Web3 transparency and real-world financial privacy.

### Usability

Public users, DAO owners, and auditors each get a clear flow.

---

## Final Positioning

> Umbra Treasury Disclosure helps DAOs operate private treasuries without sacrificing accountability.

Or shorter:

> Private DAO treasury. Selective disclosure. Accountable by design.
