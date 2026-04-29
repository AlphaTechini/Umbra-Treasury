# Applications

## Purpose

This folder contains runnable application workspaces for Umbra Treasury Disclosure.

## Architectural Decisions And Tradeoffs

The backend and frontend are split into separate application workspaces so each surface can evolve without sharing runtime-only code by accident.

The implemented workspaces are [api](file:///C:/Hackathons/Umbra%20SDK/apps/api), which exposes the Fastify backend over the Drizzle schema, and [web](file:///C:/Hackathons/Umbra%20SDK/apps/web), which contains the SvelteKit frontend.

The tradeoff is a little more workspace setup up front, but the separation makes it easier for another frontend agent to consume the backend contract without coupling to server internals.

## Logic Tracking

To find backend application logic, visit [api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).

To find frontend application logic, visit [web/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/README.md).

## Component Connections

The backend application can be found in [api](file:///C:/Hackathons/Umbra%20SDK/apps/api).

The frontend application can be found in [web](file:///C:/Hackathons/Umbra%20SDK/apps/web).
