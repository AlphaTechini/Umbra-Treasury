# Config

## Purpose

This folder contains backend environment parsing and runtime configuration.

## Architectural Decisions And Tradeoffs

Configuration is loaded through a typed Zod schema so missing or invalid environment values fail before the server accepts requests.

Non-local PostgreSQL URLs must include `sslmode=require`. Local hosts are `localhost`, `127.0.0.1`, and `::1`.

The tradeoff is a small amount of startup ceremony, but it prevents accidental hardcoding and makes deployment configuration explicit.

## Logic Tracking

To find environment validation logic, visit [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).

To find PostgreSQL SSL-mode validation, visit [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).

## Component Connections

The runtime configuration can be found in [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).
