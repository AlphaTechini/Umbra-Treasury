# Umbra Frontend Integration

## Purpose

This folder contains route-agnostic Umbra SDK integration logic. Route pages should call these helpers instead of importing protocol factories directly.

## Architectural Decisions And Tradeoffs

Umbra client creation lives in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/client.ts) because the SDK needs a connected signer and browser-safe RPC configuration. Keeping this on the frontend preserves non-custodial signing and avoids storing viewing or spending material on the backend.

Environment parsing lives in [config.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/config.ts). Public RPC and indexer URLs are still read from environment variables so deployment configuration does not drift into source code.

Encrypted-balance operations live in [encryptedBalances.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/encryptedBalances.ts). The first integration targets registration, deposits, balance queries, and withdrawals because these map cleanly to the MVP without the full mixer/indexer/relayer path.

Compliance grant helpers live in [compliance.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/compliance.ts). The helper expects explicit X25519 grant inputs so disclosure remains an intentional owner action.

Wallet discovery lives in [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts). It uses Wallet Standard registration so the app only offers installed Solana wallets that can sign Umbra transactions and messages.

The active Umbra client session lives in [session.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/session.ts). It is intentionally in-memory only, which keeps signer-backed protocol state out of local storage at the cost of requiring reconnect after a page reload.

The tradeoff is that route code must provide wallet/session state later, but the privacy boundary stays cleaner than a backend-owned signer flow.

## Logic Tracking

To find Umbra public configuration parsing, visit [config.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/config.ts).

To find Umbra client session creation, visit [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/client.ts).

To find the active in-memory Umbra client session, visit [session.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/session.ts).

To find Wallet Standard signer adaptation, visit [walletSigner.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletSigner.ts).

To find compatible wallet discovery and connect logic, visit [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

To find encrypted balance registration, deposit, query, and withdrawal logic, visit [encryptedBalances.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/encryptedBalances.ts).

To find compliance grant issue, revoke, and query logic, visit [compliance.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/compliance.ts).

To find base-unit amount validation, visit [amounts.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/amounts.ts).

To find byte parsing helpers for compliance key material, visit [bytes.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/bytes.ts).

## Component Connections

The Umbra SDK connection can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/client.ts).

The active Umbra client session can be found in [session.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/session.ts).

The encrypted balance system can be found in [encryptedBalances.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/encryptedBalances.ts).

The compliance grant system can be found in [compliance.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/compliance.ts).

The browser wallet connection system can be found in [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).
