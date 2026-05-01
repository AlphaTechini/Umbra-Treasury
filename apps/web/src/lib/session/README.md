# Frontend Session

## Purpose

This folder contains browser-side session coordination for the active wallet and active DAO.

## Architectural Decisions And Tradeoffs

Wallet session state lives in [walletSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletSession.ts). It persists the connected wallet address so returning users can resume the app flow after connecting once.

DAO session state lives in [daoSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/daoSession.ts). It persists public DAO metadata and the active slug so pages can share one selected treasury context.

Wallet connect orchestration lives in [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts). It connects the browser wallet, registers the user with the backend, then loads or creates the wallet owner's DAO workspace.

Wallet authorization signing lives in [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletAuthorization.ts). It builds the backend-required JSON message, asks the connected browser wallet to sign it, and base64-encodes the signature for Fastify verification.

The session layer intentionally stores no secrets, keys, signatures, wallet authorization messages, or private treasury payloads. The tradeoff is that returning users may still need to re-sign sensitive actions, but the privacy and authorization boundary stays cleaner.

The first demo DAO slug is `umbra-demo`. That gives integration pages a consistent initial target while leaving room for wallet-owned DAO discovery later.

## Logic Tracking

To find active DAO loading and persistence, visit [daoSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/daoSession.ts).

To find wallet address persistence, visit [walletSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletSession.ts).

To find connect-wallet registration and DAO bootstrap logic, visit [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts).

To find wallet authorization message creation and signing, visit [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletAuthorization.ts).

To find session exports, visit [index.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/index.ts).

## Component Connections

The frontend API client can be found in [../api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/README.md).

The frontend route layer can be found in [../../routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/README.md).

The wallet adapter connection can be found in [../umbra/walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

The wallet authorization system can be found in [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletAuthorization.ts).
