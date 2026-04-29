# Transactions Route

## Purpose

This folder contains the treasury transactions page.

## Architectural Decisions And Tradeoffs

The transactions route is the natural frontend surface for the backend transaction metadata endpoints. It should treat private treasury details carefully and avoid displaying sensitive fields unless the backend returns disclosure-approved report data.

The tradeoff is that the route can show public-safe metadata early while deeper Umbra-backed details remain report-scoped.

## Logic Tracking

To find transaction page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/transactions/+page.svelte).

## Component Connections

The backend transaction workflow can be found in [transactionService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/transactionService.ts).
