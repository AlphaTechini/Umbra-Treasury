# Connect Wallet Route

## Purpose

This folder contains the SvelteKit page for connecting a browser wallet and entering the DAO workspace.

## Architectural Decisions And Tradeoffs

The page in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/connect-wallet/+page.svelte) renders wallets discovered through Wallet Standard instead of hard-coded placeholder buttons. The tradeoff is that unsupported wallets no longer appear, but every visible option can run the real connect flow.

The connect workflow delegates to [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts) so the route remains focused on UI state, navigation, and user feedback.

The workflow now creates an Umbra client session and calls SDK user registration before backend DAO bootstrap. The tradeoff is that missing public RPC/WebSocket configuration blocks connect early, but that makes real protocol readiness visible instead of silently entering a fake state.

## Logic Tracking

To find wallet connect UI behavior, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/connect-wallet/+page.svelte).

To find wallet registration and DAO bootstrap logic, visit [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts).

To find in-memory Umbra client session handling, visit [session.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/session.ts).

To find compatible wallet discovery, visit [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

## Component Connections

The wallet adapter connection can be found in [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

The DAO session connection can be found in [daoSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/daoSession.ts).

The Umbra client session can be found in [session.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/session.ts).
