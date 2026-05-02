# Reports Route

## Purpose

This folder contains the reports page and the dynamic report detail route.

## Architectural Decisions And Tradeoffs

Reports should display the backend report source and verification status clearly so mock, summary-only, and Umbra-backed outputs cannot be confused.

The reports index in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/+page.svelte) can generate public summary reports and issue browser-side Umbra compliance grants before ingesting grant references. It signs `report:umbra:create` before submitting grant references, but it does not claim backend verification until backend on-chain verification exists.

The tradeoff is that report UI may feel more explicit than decorative, but disclosure trust depends on visible provenance.

## Logic Tracking

To find report page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/+page.svelte).

To find browser-issued Umbra compliance grant ingestion, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/+page.svelte).

To find report detail loading, visit [[reportId]/+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/[reportId]/+page.svelte).

To find report detail route documentation, visit [[reportId]/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/[reportId]/README.md).

## Component Connections

The backend report workflow can be found in [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).

The frontend report API helpers can be found in [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/reports.ts).
