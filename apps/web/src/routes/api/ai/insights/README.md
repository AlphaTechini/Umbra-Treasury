# Insights Endpoint

## Purpose

This folder contains the SvelteKit server endpoint that generates treasury dashboard insights.

## Architectural Decisions And Tradeoffs

The endpoint reads `GEMINI_API_KEY` from SvelteKit private runtime environment values. This avoids exposing the key through browser bundles or public configuration.

The tradeoff is that builds can succeed without a key, but the endpoint returns a `503` at runtime until the key is configured.

## Logic Tracking

To find insight generation logic, visit [+server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/api/ai/insights/+server.ts).

## Component Connections

The web environment example can be found in [../../../../.env.example](file:///C:/Hackathons/Umbra%20SDK/apps/web/.env.example).
