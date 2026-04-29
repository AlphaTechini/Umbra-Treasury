# Reports Route

## Purpose

This folder contains the reports page.

## Architectural Decisions And Tradeoffs

Reports should display the backend report source and verification status clearly so mock, summary-only, and Umbra-backed outputs cannot be confused.

The tradeoff is that report UI may feel more explicit than decorative, but disclosure trust depends on visible provenance.

## Logic Tracking

To find report page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/reports/+page.svelte).

## Component Connections

The backend report workflow can be found in [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).
