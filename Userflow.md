# User Flow - Umbra Treasury Disclosure

## Overview

Umbra Treasury Disclosure is a privacy-first DAO treasury system where:

- Treasury activity is private by default through Umbra-aligned flows.
- Public users see only aggregate summaries and report status.
- Auditors request selective disclosure.
- DAO owners approve scoped disclosure and generate source-labeled reports.

The flow should use Umbra's actual model instead of a generic decrypt-and-reveal shortcut.

---

## Actors

1. DAO Owner / Treasury Manager
2. Public Viewer / Community Member
3. Auditor / Compliance Reviewer

---

## Entry Point

### Landing Page

Primary CTA:

- `Create Private Treasury`

Secondary CTA:

- `View Public Treasury`

---

# Flow A: DAO Owner

## Step 1: Connect Wallet

- User connects Solana wallet.
- User signs an authentication message.
- Wallet becomes the DAO owner identity.

Umbra SDK flows also require an `IUmbraSigner`-compatible signer.

---

## Step 2: Create DAO Treasury

Inputs:

- DAO name
- Treasury label
- Base token
- Description

System action:

- Create DAO workspace.
- Assign owner wallet.
- Create access log entry.

---

## Step 3: Prepare Umbra Account Flow

Owner can prepare Umbra usage by:

- creating the Umbra client
- registering with Umbra when needed
- confirming supported token and network

System behavior:

- Store only public-safe setup state and operation references.
- Do not store wallet private keys or Umbra key material.

---

## Step 4: Add Treasury Activity

Inputs:

- Type: income, expense, or transfer
- Category: payroll, grant, vendor, ops, tax, transfer, or other
- Token
- Date
- Optional amount hint
- Optional public-safe counterparty label
- Optional public-safe memo
- Umbra operation type
- Umbra operation references

System behavior:

- Store workflow metadata in the database.
- Store Umbra operation references as JSON.
- Treat sensitive financial details as Umbra-protected.
- Clearly mark mock records if the demo fallback is used.

---

## Step 5: View Owner Dashboard

DAO owner sees:

- public-safe treasury summary
- private activity list
- operation status
- disclosure requests
- report status
- access logs

Important:

- Private records are not globally "revealed."
- Disclosure is report-scoped and request-scoped.

---

## Step 6: Handle Disclosure Requests

Owner receives:

- requester name
- requester organization
- reason
- requested scope
- message

Owner actions:

- approve
- reject
- choose disclosure method during approval

Disclosure scopes:

- single transaction
- category
- date range
- full report

Disclosure methods:

- viewing key
- X25519 grant
- mock fallback

---

## Step 7: Perform Umbra-Aligned Disclosure

System action:

- Use the selected Umbra compliance method where available.
- Generate a report from approved disclosure output.
- Mark report source and verification status.
- Write an access log.

Outputs:

- auditor report
- tax-style estimate
- disclosure audit trail

The app must not store raw viewing-key material.

---

# Flow B: Public Viewer

## Step 1: Access Public Treasury Page

Input:

- DAO public link or slug

---

## Step 2: View Public Summary

Visible:

- total income
- total expenses
- category breakdown
- transaction count
- report source
- verification status

Hidden:

- private amounts per transaction
- private recipients
- sensitive memos
- key material
- unapproved disclosure details

---

## Step 3: Request Disclosure

Inputs:

- name
- organization
- contact
- reason
- requested scope
- message

System action:

- Create disclosure request.
- Log request event.

---

# Flow C: Auditor

## Step 1: Submit Disclosure Request

Same as Public Viewer, but with an explicit audit, tax, grant review, or compliance reason.

---

## Step 2: Receive Approved Report

After owner approval:

- Auditor receives access to the generated report.
- Report shows source and verification status.
- Access log records the disclosure.

---

## Step 3: Review Auditor Report

Includes approved fields such as:

- operation references
- amount if disclosed
- token
- category
- approved public-safe labels
- dates
- disclosure reason
- source
- verification status

---

# Privacy Model

## Public Layer

- Aggregated totals
- Report metadata
- No sensitive transaction-level details

## Application Layer

- Workflow metadata
- Public-safe labels
- Umbra operation references
- Reports and access logs

## Umbra Layer

- Encrypted balances
- Optional mixer / UTXO privacy
- Compliance disclosure through Umbra primitives

---

# Key Principle

> Data is not private just because the UI hides it.
> Sensitive treasury truth should live in Umbra-aligned flows, not plaintext app fields.

---

# Demo Flow

1. Create DAO.
2. Prepare Umbra account flow.
3. Add three treasury activity records.
4. Open public page and show only summaries.
5. Submit disclosure request.
6. Approve request as owner.
7. Generate an Umbra-aligned or clearly marked mock disclosure report.
8. Generate auditor and tax-style reports.
9. Show access log trail.

---

# Out Of Scope

- DAO governance
- Voting systems
- Full payroll system
- Full tax engine
- Complex role-based access

---

# MVP Goal

> Prove that DAO treasury can be private by default and selectively transparent when required.
