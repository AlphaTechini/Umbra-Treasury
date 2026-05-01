# Connect Wallet Route

## Purpose

This folder contains the SvelteKit page for connecting a browser wallet and entering the DAO workspace.

## Architectural Decisions And Tradeoffs

The page in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/connect-wallet/+page.svelte) renders wallets discovered through Wallet Standard instead of hard-coded placeholder buttons. The tradeoff is that unsupported wallets no longer appear, but every visible option can run the real connect flow.

The connect workflow delegates to [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts) so the route remains focused on UI state, navigation, and user feedback.

## Logic Tracking

To find wallet connect UI behavior, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/connect-wallet/+page.svelte).

To find wallet registration and DAO bootstrap logic, visit [connectWalletFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/connectWalletFlow.ts).

To find compatible wallet discovery, visit [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

## Component Connections

The wallet adapter connection can be found in [walletAdapter.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/walletAdapter.ts).

The DAO session connection can be found in [daoSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/daoSession.ts).
