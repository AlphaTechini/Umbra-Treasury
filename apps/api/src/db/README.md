# Database

## Purpose

This folder contains database client setup for the backend.

## Architectural Decisions And Tradeoffs

Drizzle is instantiated once with a `pg` connection pool. The pool reads the connection string from the validated backend config instead of directly touching `process.env` throughout the codebase.

The tradeoff is that all database access should go through this module, but that keeps connection lifecycle and shutdown behavior centralized.

## Logic Tracking

To find Drizzle client creation, visit [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

To find the Drizzle schema, visit [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).

## Component Connections

The database connection can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

The database schema can be found in [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).
