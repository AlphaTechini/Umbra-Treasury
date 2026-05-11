# Implementation Task: Real Umbra Transactions in "New Transaction" Form

## Context

You are working on **Umbra Treasury Disclosure**, a privacy-first DAO treasury management system. Currently, the "New Transaction" form only saves metadata to the database (mock mode) without actually moving funds through the Umbra protocol.

**Your task:** Implement real Umbra transactions using the encrypted balance system.

---

## Current State

### What Works:
- ✅ Wallet connection (Solflare, Phantom, etc.)
- ✅ DAO creation and session management
- ✅ Transaction metadata storage in database
- ✅ Transaction display on dashboard and transactions page
- ✅ Currency formatting with token symbols

### What's Missing:
- ❌ Real blockchain transactions through Umbra SDK
- ❌ Deposit funds into encrypted balance
- ❌ Withdraw funds from encrypted balance to recipients
- ❌ Store Umbra operation references (signatures, tree indices, etc.)
- ❌ Update transaction status (pending → confirmed)

---

## Project Architecture

### Tech Stack:
- **Frontend:** SvelteKit 5 + Tailwind CSS
- **Backend:** Fastify (Node.js)
- **Database:** PostgreSQL (Drizzle ORM)
- **Privacy Layer:** Umbra SDK (`@umbra-privacy/sdk`)
- **Network:** Solana Devnet
- **Package Manager:** pnpm

### Key Files:
```
apps/web/src/routes/transactions/add/+page.svelte  # Transaction form (NEEDS UPDATE)
apps/web/src/lib/umbra/encryptedBalances.ts         # Umbra SDK wrappers (ALREADY EXISTS)
apps/web/src/lib/session/umbraSessionFlow.ts        # Umbra session management (ALREADY EXISTS)
apps/api/src/db/schema.ts                           # Database schema (REFERENCE)
apps/api/src/routes/transactions.ts                 # Transaction API (REFERENCE)
```

### Important Documentation:
- `README.md` - Project overview and goals
- `UMBRA.md` - Umbra integration strategy (READ THIS FIRST)
- `USERFLOW.md` - User flows and privacy model
- `apps/web/src/lib/umbra/encryptedBalances.ts` - Existing Umbra SDK wrapper functions

---

## The Goal

Transform the "New Transaction" form from **mock mode** to **real Umbra transactions** using the encrypted balance system.

### Transaction Flow:

**Type: Income (Deposit)**
```
User's Wallet → Umbra Encrypted Balance
```

**Type: Expense (Withdraw)**
```
Umbra Encrypted Balance → Recipient's Address
```

---

## Implementation Requirements

### 1. Update Transaction Form UI

**File:** `apps/web/src/routes/transactions/add/+page.svelte`

**Current form fields:**
- Type (income/expense) - dropdown
- Category (grant, payroll, vendor, ops, tax, other) - dropdown
- Token (currently just text input)
- Amount (text input)

**Required changes:**
- Add **Recipient Address** field (required for expenses, hidden for income)
- Add **Mint Address** field (token contract address)
  - Provide dropdown with common devnet tokens:
    - SOL (native): `So11111111111111111111111111111111111111112`
    - USDC (devnet): `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- Convert amount to **base units** (lamports for SOL, smallest unit for tokens)
  - SOL: multiply by 1e9 (1 SOL = 1,000,000,000 lamports)
  - USDC: multiply by 1e6 (1 USDC = 1,000,000 micro-USDC)

**UI/UX considerations:**
- Show/hide recipient field based on transaction type
- Add helper text for mint address (or use dropdown)
- Add amount conversion helper (e.g., "0.5 SOL = 500000000 lamports")
- Show loading state during blockchain transaction
- Show clear error messages if transaction fails

---

### 2. Implement Real Transaction Logic

**File:** `apps/web/src/routes/transactions/add/+page.svelte`

**Current code (lines 35-50):**
```typescript
await createTransaction(dao.id, {
  createdByWalletAddress: walletAddress,
  walletAuthorization,
  type: 'expense',
  category: toTransactionCategory(category),
  token,
  ...(amount ? { amountHint: amount } : {}),
  date: new Date().toISOString(),
  umbraOperationType: 'mock',  // ← CHANGE THIS
  umbraOperationRefs: {
    source: 'frontend_private_transaction_form',
    note: 'Recipient and memo are intentionally not stored...'
  }
});
```

**Required changes:**

#### Step 1: Get Umbra Session
```typescript
import { requireActiveUmbraSession } from '$lib/session';

const umbraSession = await requireActiveUmbraSession();
```

#### Step 2: Call Umbra SDK Based on Type

**For Income (Deposit):**
```typescript
import { depositIntoEncryptedBalance } from '$lib/umbra';

const result = await depositIntoEncryptedBalance(umbraSession, {
  destinationAddress: walletAddress, // Deposit to own encrypted balance
  mintAddress: mintAddress.trim(),
  amountBaseUnits: parseBaseUnits(amount) // Convert to lamports/smallest unit
});

const umbraOperationRefs = getUmbraOperationRefs(result, {
  source: 'frontend_real_umbra_deposit',
  mintAddress: mintAddress.trim(),
  destinationAddress: walletAddress
});

await createTransaction(dao.id, {
  // ... other fields
  umbraOperationType: 'deposit',
  umbraOperationRefs: umbraOperationRefs
});
```

**For Expense (Withdraw):**
```typescript
import { withdrawFromEncryptedBalance } from '$lib/umbra';

const result = await withdrawFromEncryptedBalance(umbraSession, {
  destinationAddress: recipientAddress.trim(),
  mintAddress: mintAddress.trim(),
  amountBaseUnits: parseBaseUnits(amount)
});

const umbraOperationRefs = getUmbraOperationRefs(result, {
  source: 'frontend_real_umbra_withdraw',
  mintAddress: mintAddress.trim(),
  destinationAddress: recipientAddress.trim()
});

await createTransaction(dao.id, {
  // ... other fields
  umbraOperationType: 'withdraw',
  umbraOperationRefs: umbraOperationRefs
});
```

---

### 3. Helper Functions

**Add these helper functions to the transaction form:**

```typescript
function parseBaseUnits(amount: string): bigint {
  // Convert human-readable amount to base units
  // Example: "0.5" SOL → 500000000n lamports
  const num = parseFloat(amount);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error('Invalid amount');
  }
  
  // Assume 9 decimals for SOL, 6 for USDC
  // You can make this dynamic based on token
  const decimals = 9; // Default to SOL
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}

function getUmbraOperationRefs(result: any, metadata: Record<string, any>) {
  // Extract operation references from Umbra SDK result
  return {
    ...metadata,
    queueSignature: result.queueSignature,
    callbackSignature: result.callbackSignature,
    treeIndex: result.treeIndex,
    insertionIndex: result.insertionIndex,
    // Add other refs as needed
  };
}

function getPrimaryReference(refs: Record<string, any>): string {
  // Return the most important reference for display
  return refs.queueSignature || refs.callbackSignature || 'No reference';
}
```

---

### 4. Error Handling

**Common errors to handle:**

1. **Insufficient balance:**
```typescript
catch (error) {
  if (error.message.includes('insufficient')) {
    toasts.add('Insufficient balance for this transaction', 'error');
  }
}
```

2. **Wallet not connected:**
```typescript
if (!umbraSession) {
  toasts.add('Connect your wallet first', 'error');
  return;
}
```

3. **Invalid recipient address:**
```typescript
if (type === 'expense' && !isValidSolanaAddress(recipientAddress)) {
  toasts.add('Invalid recipient address', 'error');
  return;
}
```

4. **Transaction timeout:**
```typescript
// Set reasonable timeout for blockchain confirmation
const TRANSACTION_TIMEOUT = 60000; // 60 seconds
```

---

### 5. Database Schema Reference

**From `apps/api/src/db/schema.ts`:**

```typescript
export const treasuryTransactions = pgTable("treasury_transactions", {
  id: text("id").primaryKey(),
  daoId: text("dao_id").notNull(),
  type: transactionTypeEnum("type").notNull(), // income, expense, transfer
  category: transactionCategoryEnum("category").notNull(),
  token: text("token").notNull(),
  amountHint: text("amount_hint"), // Optional human-readable amount
  date: timestamp("date", { withTimezone: true }).notNull(),
  publicCounterpartyLabel: text("public_counterparty_label"),
  publicMemo: text("public_memo"),
  encryptedPrivateMetadata: text("encrypted_private_metadata"),
  umbraOperationType: umbraOperationTypeEnum("umbra_operation_type").notNull(),
  umbraOperationRefs: jsonb("umbra_operation_refs").notNull(),
  umbraStatus: umbraStatusEnum("umbra_status").default("not_started").notNull(),
  privacyStatus: privacyStatusEnum("privacy_status").default("private").notNull(),
  createdById: text("created_by_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Key fields to populate:**
- `umbraOperationType`: `'deposit'` or `'withdraw'` (not `'mock'`)
- `umbraOperationRefs`: JSON object with signatures, indices, etc.
- `umbraStatus`: Start with `'pending'`, update to `'confirmed'` after blockchain confirmation

---

## Testing Checklist

### Prerequisites:
- [ ] Wallet has devnet SOL for gas fees
- [ ] Get devnet SOL from: https://faucet.solana.com/
- [ ] Wallet is connected to devnet (not mainnet)
- [ ] Backend is running (`pnpm dev:api`)
- [ ] Frontend is running (`pnpm dev:web`)

### Test Cases:

#### Test 1: Deposit (Income)
- [ ] Select "Income" type
- [ ] Select "Grant" category
- [ ] Enter mint address (SOL or USDC devnet)
- [ ] Enter amount (e.g., 0.5)
- [ ] Submit form
- [ ] Wallet prompts for signature
- [ ] Transaction confirms on blockchain
- [ ] Transaction appears in dashboard with correct amount and token
- [ ] Check database: `umbraOperationType` = `'deposit'`
- [ ] Check database: `umbraOperationRefs` contains signatures

#### Test 2: Withdraw (Expense)
- [ ] Select "Expense" type
- [ ] Select "Payroll" category
- [ ] Enter recipient address (another devnet wallet)
- [ ] Enter mint address
- [ ] Enter amount (e.g., 0.1)
- [ ] Submit form
- [ ] Wallet prompts for signature
- [ ] Transaction confirms on blockchain
- [ ] Recipient receives funds (check their wallet)
- [ ] Transaction appears in dashboard
- [ ] Check database: `umbraOperationType` = `'withdraw'`

#### Test 3: Error Handling
- [ ] Try withdraw with insufficient balance → Shows error
- [ ] Try with invalid recipient address → Shows error
- [ ] Try with invalid amount (negative, zero) → Shows error
- [ ] Disconnect wallet mid-transaction → Shows error

---

## Reference: Existing Umbra SDK Wrappers

**File:** `apps/web/src/lib/umbra/encryptedBalances.ts`

These functions are **already implemented** and ready to use:

```typescript
export async function depositIntoEncryptedBalance(
  session: UmbraClientSession,
  input: DepositIntoEncryptedBalanceInput
): Promise<DepositIntoEncryptedBalanceResult>

export async function withdrawFromEncryptedBalance(
  session: UmbraClientSession,
  input: WithdrawFromEncryptedBalanceInput
): Promise<WithdrawFromEncryptedBalanceResult>

export async function queryEncryptedBalances(
  session: UmbraClientSession,
  input: QueryEncryptedBalancesInput
): Promise<QueryEncryptedBalancesResult>
```

**You don't need to implement these - just import and use them.**

---

## Reference: Umbra Flows Page

**File:** `apps/web/src/routes/umbra/+page.svelte`

This page already has working examples of deposit and withdraw. **Study this file** to see how to:
- Call `depositIntoEncryptedBalance()`
- Call `withdrawFromEncryptedBalance()`
- Extract operation references
- Handle errors
- Show status updates

**Lines 36-80** show the deposit flow.
**Lines 110-150** show the withdraw flow.

---

## Success Criteria

When you're done:

1. ✅ User can deposit funds into encrypted balance (income transaction)
2. ✅ User can withdraw funds to recipient (expense transaction)
3. ✅ Transactions appear on blockchain (verify on Solana Explorer)
4. ✅ Transactions save to database with correct `umbraOperationType` and `umbraOperationRefs`
5. ✅ Transactions display correctly on dashboard and transactions page
6. ✅ Token symbols and amounts display correctly (e.g., "0.50 SOL")
7. ✅ Error messages are clear and helpful
8. ✅ No mock transactions - all transactions are real

---

## Important Notes

### Environment:
- **Network:** Solana Devnet (configured in `.env`)
- **Mode:** `UMBRA_MODE=real` (not mock)
- **RPC:** Use devnet RPC endpoints

### Privacy Model:
- **Don't store sensitive data in plaintext** - only store operation references
- **Amount hint** is optional and public-safe
- **Recipient address** should not be stored in plaintext for expenses (use operation refs)
- **Memos** should be encrypted or omitted

### Code Style:
- Use TypeScript
- Follow existing code patterns in the project
- Add comments for complex logic
- Use `toasts.add()` for user feedback
- Use `console.log()` for debugging (prefix with `[Transactions]`)

---

## Questions to Resolve Before Starting

1. **Token decimals:** Should we hardcode decimals (9 for SOL, 6 for USDC) or fetch dynamically?
2. **Recipient validation:** Should we validate Solana addresses client-side?
3. **Transaction confirmation:** Should we wait for blockchain confirmation before saving to database?
4. **Status updates:** Should we poll for transaction status or use webhooks?
5. **Viewing keys:** Should we generate viewing keys during transaction creation?

---

## Final Checklist

Before you start coding:
- [ ] Read `UMBRA.md` to understand the privacy model
- [ ] Read `apps/web/src/lib/umbra/encryptedBalances.ts` to see available functions
- [ ] Study `apps/web/src/routes/umbra/+page.svelte` for working examples
- [ ] Check `apps/api/src/db/schema.ts` for database schema
- [ ] Ensure devnet wallet has SOL for testing
- [ ] Confirm backend and frontend are running

During implementation:
- [ ] Test each change incrementally
- [ ] Check browser console for errors
- [ ] Check backend logs for API errors
- [ ] Verify transactions on Solana Explorer (devnet)
- [ ] Test both deposit and withdraw flows

After implementation:
- [ ] Run full test suite
- [ ] Verify database records are correct
- [ ] Check UI displays correctly
- [ ] Test error scenarios
- [ ] Commit changes with clear message

---

## Expected Outcome

After this implementation, users will be able to:
1. **Deposit funds** into their DAO's encrypted balance (income)
2. **Withdraw funds** to recipients privately (expense)
3. **See real blockchain transactions** in their wallet and on Solana Explorer
4. **View transaction history** with correct amounts and tokens
5. **Generate reports** from real Umbra-protected treasury activity

This transforms the app from a **mock demo** to a **real privacy-first treasury system**.

---

## Need Help?

If you get stuck:
1. Check the existing Umbra flows page (`/umbra`) for working examples
2. Read the Umbra SDK documentation
3. Check the browser console for errors
4. Check the backend logs for API errors
5. Verify your wallet is on devnet and has SOL

Good luck! 🚀
