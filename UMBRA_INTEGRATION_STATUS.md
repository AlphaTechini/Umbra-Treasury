# Umbra Integration Status

## What's Been Implemented

### 1. SDK Installation
- Installed `@umbra-privacy/sdk` (v4.0.0)
- Installed `@umbra-privacy/web-zk-prover` (v2.0.1)
- Dependencies are in place for full protocol integration

### 2. Provider Architecture
- **UmbraProvider Interface** - Expanded to cover all core operations:
  - `registerUser()` - Umbra account registration
  - `deposit()` - Public balance → encrypted balance
  - `withdraw()` - Encrypted balance → public balance
  - `queryBalance()` - Query encrypted balance
  - `issueDisclosureGrant()` - X25519 compliance grants for auditors

### 3. Mock Provider (Complete)
- Fully implements all interface methods
- Returns clearly labeled mock data
- Allows demo flows to work without real protocol calls
- Source marked as `"mock"` in all outputs

### 4. Real Provider (Foundation Complete)
- `RealUmbraProvider` class created
- Client initialization logic implemented
- Network configuration (mainnet/devnet)
- RPC endpoint configuration (HTTP + WebSocket)
- Indexer endpoint configuration
- Client caching per wallet address

### 5. Configuration
- Added environment variables:
  - `UMBRA_MODE` - `mock` or `real`
  - `UMBRA_NETWORK` - `mainnet` or `devnet`
  - `UMBRA_RPC_HTTP_URL` - Solana RPC HTTP endpoint
  - `UMBRA_RPC_WS_URL` - Solana RPC WebSocket endpoint
  - `UMBRA_INDEXER_URL` - Umbra UTXO indexer
  - `UMBRA_RELAYER_URL` - Umbra relayer for claims
- Updated `.env.example` with all new variables
- Validation in `env.ts`

### 6. Provider Factory
- Updated to instantiate `RealUmbraProvider` when `UMBRA_MODE=real`
- No longer throws 501 error for real mode
- Clean switch between mock and real implementations

---

## What's Not Yet Implemented

### The Core Challenge: Wallet Signer Context

All Umbra SDK operations require an `IUmbraSigner` - a wallet that can:
- Sign transactions (`signTransaction`, `signTransactions`)
- Sign messages (`signMessage`)
- Provide the user's public key/address

**The backend cannot create this signer** because:
1. Private keys must never leave the user's wallet
2. Umbra operations are non-custodial by design
3. The signer must come from the frontend wallet connection

### Operations Requiring Wallet Signer

All five provider methods need a signer:

1. **registerUser()** - Creates Umbra account, derives X25519 keys, submits user commitment proof
2. **deposit()** - Signs transaction to move tokens from public ATA to encrypted balance
3. **withdraw()** - Signs transaction to move tokens from encrypted balance back to public ATA
4. **queryBalance()** - Requires user's master viewing key (derived from wallet signature)
5. **issueDisclosureGrant()** - Signs X25519 compliance grant transaction

Currently, these methods throw `501 Not Implemented` with a clear message explaining the wallet signer requirement.

---

## Next Steps: Frontend Integration

To complete the real Umbra integration, the frontend needs to:

### 1. Install Umbra SDK in Frontend
```bash
cd apps/web
pnpm add @umbra-privacy/sdk @umbra-privacy/web-zk-prover
```

### 2. Create Wallet Adapter
The frontend already has Solana wallet connection. We need to:
- Wrap the connected wallet in an `IUmbraSigner` adapter
- Use `createSignerFromWalletAccount()` from the SDK
- Pass the signer to backend operations via API calls

### 3. Frontend-Driven Umbra Operations

Instead of backend-only calls, operations become:

**Current (Mock) Flow:**
```
Frontend → Backend API → MockProvider → Returns fake data
```

**Real Flow:**
```
Frontend connects wallet
Frontend creates Umbra client with signer
Frontend calls Umbra SDK directly for:
  - Registration
  - Deposits
  - Withdrawals
  - Balance queries
Frontend sends operation results to backend for:
  - Storing transaction references
  - Updating treasury records
  - Generating reports
```

### 4. Hybrid Architecture

Some operations stay frontend-only:
- User registration
- Deposits/withdrawals
- Balance queries

Some operations involve both:
- **Compliance grants** - Frontend signs grant, backend stores grant reference
- **Report generation** - Backend queries stored references, frontend provides viewing keys if needed

### 5. Specific Implementation Tasks

#### Task 1: User Registration Flow
```typescript
// Frontend (apps/web)
import { getUmbraClient, getUserRegistrationFunction } from '@umbra-privacy/sdk';

const client = await getUmbraClient({
  signer: walletSigner, // from Solana wallet adapter
  network: 'devnet',
  rpcUrl: PUBLIC_UMBRA_RPC_HTTP_URL,
  rpcSubscriptionsUrl: PUBLIC_UMBRA_RPC_WS_URL,
  indexerApiEndpoint: PUBLIC_UMBRA_INDEXER_URL,
});

const register = getUserRegistrationFunction({ client });
await register({ confidential: true, anonymous: true });

// Then notify backend that registration is complete
await fetch('/api/users/umbra-registered', {
  method: 'POST',
  body: JSON.stringify({ walletAddress, userCommitment }),
});
```

#### Task 2: Treasury Deposit Flow
```typescript
// Frontend
import { getPublicBalanceToEncryptedBalanceDirectDepositorFunction } from '@umbra-privacy/sdk';

const deposit = getPublicBalanceToEncryptedBalanceDirectDepositorFunction({ client });
const result = await deposit(walletAddress, mintAddress, amount);

// Send transaction references to backend
await fetch('/api/transactions', {
  method: 'POST',
  body: JSON.stringify({
    daoId,
    type: 'income',
    category: 'grant',
    token: mintAddress,
    umbraOperationType: 'deposit',
    umbraOperationRefs: {
      queueSignature: result.queueSignature,
      callbackSignature: result.callbackSignature,
    },
    umbraStatus: 'confirmed',
  }),
});
```

#### Task 3: Compliance Disclosure Flow
```typescript
// Frontend
import { getComplianceGrantIssuerFunction } from '@umbra-privacy/sdk';

const issueGrant = getComplianceGrantIssuerFunction({ client });
const grantResult = await issueGrant({
  auditorX25519PublicKey,
  mint: tokenMint,
  // ... other grant params
});

// Backend receives grant reference and generates report
await fetch(`/api/disclosure-requests/${requestId}/approve`, {
  method: 'POST',
  body: JSON.stringify({
    disclosureMethod: 'x25519_grant',
    grantSignature: grantResult.signature,
    grantAccount: grantResult.accountAddress,
  }),
});
```

---

## Why This Architecture?

### Security
- Private keys never leave the user's wallet
- Backend never has custody of funds
- Non-custodial by design

### Correctness
- Umbra SDK requires wallet signer for all operations
- Cannot be faked or bypassed
- Protocol enforces this at the transaction level

### Separation of Concerns
- **Frontend**: Wallet interaction, Umbra protocol calls, user consent
- **Backend**: Workflow metadata, operation references, report generation, access logs

---

## Current State Summary

✅ **Complete:**
- SDK installed
- Provider architecture designed
- Mock provider fully functional
- Real provider foundation (client setup, configuration)
- Environment configuration
- Documentation

⏳ **Pending Frontend Integration:**
- Wallet signer adapter
- Frontend Umbra client setup
- Registration flow
- Deposit/withdraw flows
- Balance query flow
- Compliance grant flow
- Frontend-to-backend operation result passing

---

## Demo Capability

**Right now with `UMBRA_MODE=mock`:**
- Full demo flow works end-to-end
- All features functional with clearly labeled mock data
- Perfect for showcasing the product concept
- Reports clearly show `source: "mock"`

**After frontend integration with `UMBRA_MODE=real`:**
- Real Umbra protocol integration
- Actual encrypted balances
- Real compliance grants
- Verified reports with `source: "umbra_compliance"`
- Production-ready privacy layer

---

## Recommendation

For the hackathon demo:
1. **Keep using `UMBRA_MODE=mock`** - it works perfectly for demonstrating the product
2. **Highlight the architecture** - show that the real provider exists and is ready
3. **Explain the wallet signer requirement** - this is a feature, not a limitation (non-custodial design)
4. **Show the integration path** - the frontend tasks are clear and straightforward

The mock mode is not a compromise - it's a deliberate design that lets you demo the full product flow while the real integration follows the correct non-custodial architecture.
