# Umbra Operations Route

## Purpose

This folder contains the browser-facing page for real Umbra encrypted balance operations.

## Architectural Decisions And Tradeoffs

The operations page lives in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/umbra/+page.svelte). It keeps deposit, encrypted balance query, and withdrawal in one operator-focused surface so the demo can prove the full Umbra flow without scattering protocol actions across several pages.

The page records deposit and withdrawal references through the backend transaction API, but encrypted balance query results stay browser-only. The tradeoff is that operators must run queries from an active wallet session, while the backend avoids storing private balance details.

The page reuses the active in-memory Umbra client session when possible and recreates it through the selected wallet when needed. This preserves the no-secret-persistence rule while still supporting reload recovery.

The route options in [+page.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/umbra/+page.ts) disable SSR for this page because real Umbra SDK and wallet operations are browser-only.

## Logic Tracking

To find real Umbra deposit, query, and withdrawal UI logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/umbra/+page.svelte).

To find route rendering options, visit [+page.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/umbra/+page.ts).

To find Umbra encrypted balance SDK wrappers, visit [../../lib/umbra/encryptedBalances.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/encryptedBalances.ts).

To find Umbra session recovery, visit [../../lib/session/umbraSessionFlow.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/umbraSessionFlow.ts).

To find backend transaction recording helpers, visit [../../lib/api/transactions.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/transactions.ts).

## Component Connections

The Umbra status display can be found in [../../lib/components/UmbraStatusPanel.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/UmbraStatusPanel.svelte).

The wallet authorization system can be found in [../../lib/session/walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletAuthorization.ts).
