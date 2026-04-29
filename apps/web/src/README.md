# Web Source

## Purpose

This folder contains the SvelteKit source for the frontend application.

## Architectural Decisions And Tradeoffs

Routes and server endpoints live under [routes](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes), while reusable UI pieces and helpers live under [lib](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib).

The tradeoff is standard SvelteKit convention over custom architecture. That keeps the imported frontend easy to maintain and easy for Svelte tooling to understand.

## Logic Tracking

To find routes and pages, visit [routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/README.md).

To find shared components and helpers, visit [lib/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/README.md).

To find the HTML document shell, visit [app.html](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/app.html).

To find global styling, visit [index.css](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/index.css).

## Component Connections

The route layer can be found in [routes](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes).

The shared frontend library can be found in [lib](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib).
