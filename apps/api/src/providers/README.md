# Providers

## Purpose

This folder contains external integration boundaries for the backend.

## Architectural Decisions And Tradeoffs

Umbra calls are hidden behind a provider contract so the workflow services do not depend directly on SDK details, prover setup, relayers, or indexer behavior.

Two providers are implemented:

1. **MockUmbraProvider** - Clearly labeled demo fallback that marks all generated output as mock data. Allows the demo to run before real Umbra infrastructure is configured.

2. **RealUmbraProvider** - Actual Umbra SDK integration that connects to the protocol. Currently implements the client setup and configuration layer. Full wallet-signer integration for registration, deposits, withdrawals, balance queries, and compliance grants requires frontend wallet context and will be completed when the frontend Umbra integration is built.

The provider interface covers:
- User registration (Umbra account setup)
- Deposits (public balance → encrypted balance)
- Withdrawals (encrypted balance → public balance)
- Balance queries (encrypted balance decryption)
- Compliance disclosure grants (X25519 re-encryption for auditors)

The tradeoff is that backend-only operations are limited without a wallet signer. The real provider establishes the integration boundary and configuration, but wallet-dependent operations will be completed through frontend-to-backend flows.

## Logic Tracking

To find the Umbra provider contract, visit [umbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts).

To find the mock Umbra provider, visit [mockUmbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/mockUmbraProvider.ts).

To find the real Umbra provider, visit [realUmbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/realUmbraProvider.ts).

To find provider selection logic, visit [providerFactory.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/providerFactory.ts).

## Component Connections

The Umbra integration boundary can be found in [umbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts).

## Configuration

The provider mode is controlled by `UMBRA_MODE` environment variable:
- `mock` - Uses MockUmbraProvider (default)
- `real` - Uses RealUmbraProvider with actual Umbra SDK

Additional configuration for real mode:
- `UMBRA_NETWORK` - `mainnet` or `devnet` (default: `devnet`)
- `UMBRA_RPC_HTTP_URL` - Solana RPC HTTP endpoint (optional, defaults to public endpoints)
- `UMBRA_RPC_WS_URL` - Solana RPC WebSocket endpoint (optional, defaults to public endpoints)
- `UMBRA_INDEXER_URL` - Umbra UTXO indexer endpoint (optional, defaults to official endpoints)
- `UMBRA_RELAYER_URL` - Umbra relayer endpoint for claim operations (optional)
