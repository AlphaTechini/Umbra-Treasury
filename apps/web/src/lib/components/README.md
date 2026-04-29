# Components

## Purpose

This folder contains reusable Svelte components.

## Architectural Decisions And Tradeoffs

The current component set keeps navigation and toast display reusable across routes. Components stay focused on one UI concern each.

The tradeoff is that route-specific composition remains in route files until it becomes shared enough to promote here.

## Logic Tracking

To find sidebar navigation logic, visit [Sidebar.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/Sidebar.svelte).

To find toast display logic, visit [ToastContainer.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/ToastContainer.svelte).

To find the reusable Umbra operation status panel, visit [UmbraStatusPanel.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/UmbraStatusPanel.svelte).

## Component Connections

The shared frontend library can be found in [../README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/README.md).

The Umbra operation status component can be found in [UmbraStatusPanel.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/components/UmbraStatusPanel.svelte).
