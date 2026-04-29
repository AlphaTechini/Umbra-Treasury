# Frontend Library

## Purpose

This folder contains shared frontend helpers, state, and reusable components.

## Architectural Decisions And Tradeoffs

Small state helpers live beside utility modules because the current frontend surface is compact. Larger feature-specific state should move into feature folders when it appears.

The tradeoff is minimal ceremony today while still keeping reusable code out of route pages.

## Logic Tracking

To find shared class-name utilities, visit [utils.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/utils.ts).

To find toast state logic, visit [toasts.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/toasts.ts).

To find loading state logic, visit [loading.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/loading.ts).

To find Umbra SDK integration logic, visit [umbra/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra/README.md).

To find reusable UI components, visit [components/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/README.md).

## Component Connections

The component library can be found in [components](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components).

The Umbra frontend integration can be found in [umbra](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/umbra).
