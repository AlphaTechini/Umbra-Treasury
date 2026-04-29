# Services

## Purpose

This folder contains backend workflow logic.

## Architectural Decisions And Tradeoffs

Services coordinate repositories, access logs, and providers. They do not receive Fastify request objects, which keeps business logic testable later without adding tests now.

The tradeoff is a small mapping layer between HTTP request payloads and database enum values, but the API and database now both use frontend-friendly lowercase values.

## Logic Tracking

To find enum mapping logic, visit [enumMappers.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/enumMappers.ts).

To find user workflow logic, visit [userService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/userService.ts).

To find DAO workflow logic, visit [daoService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/daoService.ts).

To find transaction workflow logic, visit [transactionService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/transactionService.ts).

To find public summary logic, visit [summaryService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/summaryService.ts).

To find disclosure request logic, visit [disclosureService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/disclosureService.ts).

To find report generation logic, visit [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).

To find Umbra compliance report generation logic, visit [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).

To find access log query logic, visit [accessLogService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/accessLogService.ts).

## Component Connections

The repository layer can be found in [repositories](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories).

The Umbra provider boundary can be found in [providers](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers).
