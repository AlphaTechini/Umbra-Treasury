# Repositories

## Purpose

This folder contains database access modules for Drizzle tables.

## Architectural Decisions And Tradeoffs

Repositories hide Drizzle query details from services. Services should decide workflow behavior, while repositories should only create, read, and update records.

The tradeoff is a few small pass-through modules, but it keeps query shape changes localized when the schema evolves.

## Logic Tracking

To find user persistence logic, visit [userRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/userRepository.ts).

To find DAO persistence logic, visit [daoRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/daoRepository.ts).

To find treasury transaction persistence logic, visit [transactionRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/transactionRepository.ts).

To find disclosure request persistence logic, visit [disclosureRequestRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/disclosureRequestRepository.ts).

To find report persistence logic, visit [reportRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/reportRepository.ts).

To find access log persistence logic, visit [accessLogRepository.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/accessLogRepository.ts).

## Component Connections

The Drizzle connection can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).
