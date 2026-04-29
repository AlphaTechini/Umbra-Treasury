# Config

## Purpose

This folder contains backend environment parsing and runtime configuration.

## Architectural Decisions And Tradeoffs

Configuration is loaded through a typed Zod schema so missing or invalid environment values fail before the server accepts requests.

The tradeoff is a small amount of startup ceremony, but it prevents accidental hardcoding and makes deployment configuration explicit.

## Logic Tracking

To find environment validation logic, visit [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).

## Component Connections

The runtime configuration can be found in [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).
