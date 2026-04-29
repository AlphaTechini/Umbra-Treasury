# Dashboard Route

## Purpose

This folder contains the treasury dashboard page.

## Architectural Decisions And Tradeoffs

The dashboard is currently route-local presentation code. Backend integration should replace any static demo data with calls to the Fastify API summary and access-log endpoints.

The tradeoff is fast visual iteration now with a clear later handoff to API-backed state.

## Logic Tracking

To find dashboard page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/dashboard/+page.svelte).

## Component Connections

The backend public summary endpoint can be found in [summaryService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/summaryService.ts).
