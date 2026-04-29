# Applications

## Purpose

This folder contains runnable application workspaces for Umbra Treasury Disclosure.

## Architectural Decisions And Tradeoffs

The backend and frontend are split into separate application workspaces so each surface can evolve without sharing runtime-only code by accident.

The current implemented workspace is [api](file:///C:/Hackathons/Umbra%20SDK/apps/api), which exposes the Fastify backend over the Drizzle schema. The frontend is intentionally not added here because it is being handled separately.

The tradeoff is a little more workspace setup up front, but the separation makes it easier for another frontend agent to consume the backend contract without coupling to server internals.

## Logic Tracking

To find backend application logic, visit [api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).

## Component Connections

The backend application can be found in [api](file:///C:/Hackathons/Umbra%20SDK/apps/api).
