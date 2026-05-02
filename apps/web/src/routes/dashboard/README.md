# Dashboard Route

## Purpose

This folder contains the treasury dashboard page.

## Architectural Decisions And Tradeoffs

The dashboard in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/dashboard/+page.svelte) loads the active DAO when available, falls back to the legacy demo DAO, and reads public-safe summary, transaction, disclosure request, and access activity data from the Fastify API.

The tradeoff is that the dashboard still performs route-local data loading instead of using a larger app-wide query cache, but the page now reflects backend state without storing sensitive transaction details.

## Logic Tracking

To find dashboard page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/dashboard/+page.svelte).

To find access activity display logic, visit [AccessLogPanel.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/AccessLogPanel.svelte).

To find DAO summary API helpers, visit [daos.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/daos.ts).

## Component Connections

The backend public summary endpoint can be found in [summaryService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/summaryService.ts).

The frontend DAO session connection can be found in [daoSession.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/daoSession.ts).

The access log API connection can be found in [accessLogs.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/accessLogs.ts).
