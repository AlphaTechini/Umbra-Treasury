# Settings Route

## Purpose

This folder contains the frontend settings page.

## Architectural Decisions And Tradeoffs

Settings remain route-local until wallet authentication, environment selection, and Umbra mode controls are wired into real backend behavior.

The tradeoff is a simpler first import while leaving room for real configuration flows later.

## Logic Tracking

To find settings page logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/settings/+page.svelte).

## Component Connections

Backend environment parsing can be found in [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).
