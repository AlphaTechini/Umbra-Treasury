# Report Detail Route

## Purpose

This folder contains the SvelteKit page for viewing a single generated report by backend report id.

## Architectural Decisions And Tradeoffs

The page in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/[reportId]/+page.svelte) calls the typed report API helper instead of receiving report data through navigation state. The tradeoff is one additional backend read, but deep links and refreshes work correctly.

## Logic Tracking

To find report detail loading, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/[reportId]/+page.svelte).

To find report API helpers, visit [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/reports.ts).

## Component Connections

The report list route can be found in [../+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/+page.svelte).

The backend report routes can be found in [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/reports.ts).
