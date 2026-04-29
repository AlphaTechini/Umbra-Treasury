# Prisma Schema

## Purpose

This folder contains the database schema for Umbra Treasury Disclosure.

## Architectural Decisions And Tradeoffs

The schema implements the MVP data model from [Schema.md](file:///C:/Hackathons/Umbra%20SDK/Schema.md) with six tables: users, DAOs, treasury transaction metadata, disclosure requests, reports, and access logs.

Prisma 7 keeps the database URL in [prisma.config.ts](file:///C:/Hackathons/Umbra%20SDK/prisma.config.ts), not inside [schema.prisma](file:///C:/Hackathons/Umbra%20SDK/prisma/schema.prisma). The schema only declares the PostgreSQL provider.

The schema intentionally does not add a `compliance_disclosures` table yet. Reports are the first disclosure artifact because that keeps sensitive disclosed output scoped and reduces unnecessary database surface area for the MVP.

Umbra operation references are stored as JSON through `umbraOperationRefs`. This is more flexible than a single transaction signature because Umbra operations can involve queue signatures, callback signatures, relayer request IDs, UTXO indexes, or compliance grant references.

The tradeoff is that application code must validate the JSON shape for each operation type. That validation belongs in backend service logic once the backend is implemented.

## Logic Tracking

To find the Prisma data model, visit [schema.prisma](file:///C:/Hackathons/Umbra%20SDK/prisma/schema.prisma).

To find the schema rationale and field-level decisions, visit [Schema.md](file:///C:/Hackathons/Umbra%20SDK/Schema.md).

To find the Umbra integration model behind the schema, visit [Umbra.md](file:///C:/Hackathons/Umbra%20SDK/Umbra.md).

## Component Connections

The database schema can be found in [schema.prisma](file:///C:/Hackathons/Umbra%20SDK/prisma/schema.prisma).

The Prisma CLI configuration can be found in [prisma.config.ts](file:///C:/Hackathons/Umbra%20SDK/prisma.config.ts).

The project structure map can be found in [structure.md](file:///C:/Hackathons/Umbra%20SDK/structure.md).

The implementation memory can be found in [GUIDE.md](file:///C:/Hackathons/Umbra%20SDK/.agents/GUIDE.md).
