# Database

## Purpose

This folder contains database client setup for the backend.

## Architectural Decisions And Tradeoffs

Drizzle is instantiated once with a `pg` connection pool. The pool reads the connection string from the validated backend config instead of directly touching `process.env` throughout the codebase.

The pool is configured for Supabase's **session pooler** (PgBouncer on port 6543). Session mode assigns a real backend connection for the lifetime of a client checkout, so a `pg.Pool` works correctly here. The pool caps at 10 connections with explicit idle and connection timeouts to avoid leaking connections against the pooler's limit.

Report workflows use an explicit transaction helper from this folder so report creation, disclosure fulfillment, and access-log writes commit together.

The tradeoff is that all database access should go through this module, but that keeps connection lifecycle, readiness checks, and transaction behavior centralized.

## Logic Tracking

To find Drizzle client creation, visit [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

To find database transaction and readiness helpers, visit [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

To find the Drizzle schema, visit [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).

## Component Connections

The database connection can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

The database readiness check can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

The database schema can be found in [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).
