# Migrations

## Purpose

This folder contains SQL migrations for the PostgreSQL database.

## Architectural Decisions And Tradeoffs

Drizzle keeps migrations as readable SQL files. That makes schema review easier than generated ORM state hidden inside application code.

The tradeoff is that schema evolution needs deliberate migration review. For this project, that is acceptable because treasury disclosure storage should stay explicit and easy to audit.

## Logic Tracking

To find the initial database schema, visit [0000_bent_xorn.sql](file:///C:/Hackathons/Umbra%20SDK/migrations/0000_bent_xorn.sql).

## Component Connections

The Drizzle schema can be found in [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).

The Drizzle configuration can be found in [drizzle.config.ts](file:///C:/Hackathons/Umbra%20SDK/drizzle.config.ts).

The migration journal and snapshots live in `meta`. That folder intentionally does not contain a README because Drizzle Kit parses files in that folder as JSON metadata.
