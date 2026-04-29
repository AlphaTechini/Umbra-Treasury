# Insight Endpoints

## Purpose

This folder groups server endpoints for generated treasury insights.

## Architectural Decisions And Tradeoffs

Insight generation is separate from disclosure workflow APIs because it depends on an optional Gemini key and does not own treasury persistence.

The tradeoff is that generated insight behavior can be disabled without affecting the core treasury disclosure flow.

## Logic Tracking

To find the insight generation endpoint, visit [insights/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/api/ai/insights/README.md).

## Component Connections

The web environment example can be found in [../../../.env.example](file:///C:/Hackathons/Umbra%20SDK/apps/web/.env.example).
