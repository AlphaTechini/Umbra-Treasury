# Web Server Endpoints

## Purpose

This folder contains SvelteKit server endpoints for frontend-owned server behavior.

## Architectural Decisions And Tradeoffs

Only frontend-specific server endpoints should live here. Treasury workflow APIs belong in the Fastify backend under [apps/api](file:///C:/Hackathons/Umbra%20SDK/apps/api).

The tradeoff is an extra boundary between web-owned helper endpoints and product backend APIs, but it keeps deployment responsibilities clear.

## Logic Tracking

To find insight endpoints, visit [ai/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/api/ai/README.md).

## Component Connections

The Fastify backend can be found in [../../../../api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).
