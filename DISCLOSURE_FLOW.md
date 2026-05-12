# Umbra Treasury Disclosure Flow

## Overview

This document explains how the selective transparency disclosure system works in Umbra Treasury.

## Key Concept: No Pre-Generated Viewing Keys

**Important**: Umbra's encrypted balance system does NOT generate viewing keys during deposit/withdraw operations. Instead, disclosure happens through **X25519 compliance grants** that are issued on-demand when a disclosure request is approved.

## The Complete Flow

### 1. DAO Owner Creates Private Transactions

**Route**: `/transactions/add`

- DAO owner connects wallet
- Deposits funds into encrypted balance OR withdraws to recipient
- Transaction details are encrypted on-chain via Umbra
- Database stores only:
  - Public-safe metadata (category, date, operation type)
  - Umbra operation references (signatures, transaction IDs)
  - NO plaintext amounts or recipient details

### 2. Public Views DAO Summary

**Route**: `/daos/[slug]` (e.g., `/daos/institutional-dao`)

**No wallet required!**

- Anyone can visit this page
- Shows aggregate summaries only:
  - Total income
  - Total expenses
  - Net treasury
  - Category breakdowns
  - Transaction counts
- Individual transaction details remain private
- "Request Disclosure" button visible

### 3. Auditor Requests Disclosure

**Route**: `/daos/[slug]/request-disclosure`

**No wallet required!**

- Auditor fills out form:
  - Name (required)
  - Organization (optional)
  - Contact email (required)
  - Reason (audit, tax, grant review, etc.)
  - Scope (single transaction, category, date range, or full report)
  - Additional message
- Request is stored in the DAO's database
- Auditor receives confirmation

### 4. DAO Owner Reviews Request

**Route**: `/disclosures`

**Wallet required** (DAO owner only)

- Owner sees all pending disclosure requests
- For each request, owner can see:
  - Requester name and organization
  - Reason for request
  - Requested scope
  - Message
- Owner can:
  - **Approve** → Issues X25519 compliance grant
  - **Reject** → Denies access

### 5. System Issues X25519 Compliance Grant

**When approved:**

- System calls Umbra SDK's `issueUmbraComplianceGrant()` function
- Creates cryptographic grant that allows auditor to decrypt specific data
- Grant is scoped to the approved request (single tx, category, date range, or full)
- Grant signature/account is stored as operation reference

### 6. System Generates Report

**Automatic after grant issuance:**

- System generates report based on approved scope
- Report includes:
  - Disclosed transaction details
  - Umbra operation references
  - Verification status
  - Source label (`umbra_compliance`)
- Report is stored with unique ID

### 7. Auditor Accesses Report

**Route**: `/reports/[reportId]/view` (to be implemented)

**No wallet required!**

- Auditor receives report ID or link
- Can view disclosed data
- Report clearly shows:
  - What was disclosed
  - Verification status
  - Source (Umbra compliance vs mock)

## Current Implementation Status

### ✅ Implemented

- [x] Private transaction creation (deposit/withdraw)
- [x] Public DAO page by slug
- [x] Wallet-free disclosure request form
- [x] DAO owner disclosure review page
- [x] X25519 compliance grant functions (SDK wrappers exist)

### ❌ Not Yet Implemented

- [ ] Actual X25519 grant issuance in approval flow
- [ ] Report generation after grant issuance
- [ ] Public report access page for auditors
- [ ] Email notifications for request status changes

## Technical Details

### Database Schema

**Transactions Table**:
- `umbraOperationType`: deposit, withdraw, compliance_grant, etc.
- `umbraOperationRefs`: JSONB field storing:
  - `signatures`: Array of transaction signatures
  - `transactionReferences`: Array of on-chain references
  - `fullResult`: Complete Umbra SDK response (for debugging)
  - NO viewing keys (they don't exist in this model)

**Disclosure Requests Table**:
- `status`: pending, approved, rejected, fulfilled
- `disclosureMethod`: viewing_key, x25519_grant, mock
- `fulfilledReportId`: Links to generated report

**Reports Table**:
- `source`: summary_only, umbra_compliance, mock
- `verificationStatus`: unverified, verified, failed
- `reportData`: JSONB with disclosed information

### Umbra SDK Functions Used

**For Transactions**:
- `depositIntoEncryptedBalance()` - Creates encrypted balance
- `withdrawFromEncryptedBalance()` - Withdraws to recipient
- `queryEncryptedBalances()` - Checks balance (client-side only)

**For Disclosure**:
- `issueUmbraComplianceGrant()` - Issues X25519 grant to auditor
- `revokeUmbraComplianceGrant()` - Revokes previously issued grant
- `queryUmbraComplianceGrant()` - Checks grant status

## Security Model

### What's Private

- Individual transaction amounts
- Recipient addresses
- Transaction memos
- Encrypted balance values

### What's Public

- Aggregate totals (income, expenses, net)
- Category breakdowns (aggregated)
- Transaction counts
- Operation types (deposit, withdraw)
- Public-safe labels

### What's Disclosed (On Approval)

- Specific transaction details within approved scope
- Amounts for disclosed transactions
- Recipients for disclosed transactions
- Dates and categories
- Umbra operation references for verification

## Next Steps

To complete the disclosure flow:

1. **Update approval handler** in `/disclosures` to call `issueUmbraComplianceGrant()`
2. **Generate report** after grant issuance using backend service
3. **Create report view page** at `/reports/[reportId]/view`
4. **Add email notifications** (optional but recommended)
5. **Test end-to-end flow** with real Umbra operations on devnet

## Demo Flow

1. Visit `/daos/institutional-dao` (public page)
2. Click "Request Disclosure"
3. Fill out form (no wallet needed)
4. Submit request
5. DAO owner logs in and sees request at `/disclosures`
6. Owner approves request
7. System issues X25519 grant and generates report
8. Auditor receives report link
9. Auditor views disclosed data

## References

- `README.md` - Project overview and privacy model
- `USERFLOW.md` - Detailed user flows for all actors
- `UMBRA.md` - Umbra integration strategy
- `apps/web/src/lib/umbra/compliance.ts` - X25519 grant functions
- `apps/api/src/services/reportService.ts` - Report generation logic
