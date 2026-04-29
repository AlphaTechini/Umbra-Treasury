# API Source

## Purpose

This folder contains the TypeScript source for the Fastify backend.

## Architectural Decisions And Tradeoffs

The source is split by responsibility: routes handle HTTP, services handle workflow decisions, repositories handle Drizzle queries, providers isolate Umbra behavior, and shared utilities keep validation and error handling consistent.

The tradeoff is more files than a small demo server, but it keeps the backend aligned with the project rule that one file should own one feature or major function.

## Logic Tracking

To find the app composition, visit [app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts).

To find global client error response handling, visit [app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts).

To find the process entrypoint, visit [server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/server.ts).

To find configuration loading, visit [config/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/README.md).

To find database setup, visit [db/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/README.md).

To find route handlers, visit [routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/README.md).

To find service logic, visit [services/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/README.md).

To find repository logic, visit [repositories/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/README.md).

To find provider boundaries, visit [providers/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/README.md).

To find shared helpers, visit [utils/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/README.md).

## Component Connections

The Fastify app can be found in [app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts).

The server startup can be found in [server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/server.ts).
