# Routes

## Purpose

This folder contains SvelteKit pages, layouts, and server endpoints.

## Architectural Decisions And Tradeoffs

The frontend currently uses route-level pages for the dashboard, transactions, reports, and settings surfaces. This keeps the imported app close to SvelteKit conventions and avoids creating a custom router layer.

The tradeoff is that page files hold some presentation-specific data until backend integration replaces mock UI state.

## Logic Tracking

To find the app layout, visit [+layout.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/+layout.svelte).

To find the landing page, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/+page.svelte).

To find the wallet connect page, visit [connect-wallet/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/connect-wallet/README.md).

To find the dashboard page, visit [dashboard/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/dashboard/README.md).

To find the transactions page, visit [transactions/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/transactions/README.md).

To find the reports page, visit [reports/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/README.md).

To find the settings page, visit [settings/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/settings/README.md).

To find server endpoints, visit [api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/api/README.md).

## Component Connections

Shared components can be found in [../lib/components/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/README.md).
