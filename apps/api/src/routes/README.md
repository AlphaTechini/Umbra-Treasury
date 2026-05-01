# Routes

## Purpose

This folder contains Fastify route modules.

## Architectural Decisions And Tradeoffs

Each route module owns one API feature area and delegates workflow to services. Zod validates request payloads at the HTTP edge so services can work with already-shaped inputs.

The tradeoff is that validation schemas sit close to route handlers instead of a shared OpenAPI layer. That is faster for the current MVP and can be promoted to generated API docs later.

## Logic Tracking

To find health routes, visit [health.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/health.ts).

To find database readiness routes, visit [health.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/health.ts).

To find user routes, visit [users.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/users.ts).

To find DAO routes and owner DAO lookup, visit [daos.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/daos.ts).

To find transaction routes, visit [transactions.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/transactions.ts).

To find disclosure request routes, visit [disclosureRequests.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/disclosureRequests.ts).

To find report routes, visit [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/reports.ts).

To find the Umbra compliance report ingestion route, visit [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/reports.ts).

To find access log routes, visit [accessLogs.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/accessLogs.ts).

## Component Connections

The service layer can be found in [services](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services).
