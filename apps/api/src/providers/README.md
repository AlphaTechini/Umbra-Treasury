# Providers

## Purpose

This folder contains external integration boundaries for the backend.

## Architectural Decisions And Tradeoffs

Umbra calls are hidden behind a provider contract so the workflow services do not depend directly on SDK details, prover setup, relayers, or indexer behavior.

The first implemented provider is mock-only and marks all generated output as mock data. The tradeoff is that the first demo can run before real Umbra infrastructure is configured, while still keeping a clean replacement path for protocol-backed disclosure.

## Logic Tracking

To find the Umbra provider contract, visit [umbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts).

To find the mock Umbra provider, visit [mockUmbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/mockUmbraProvider.ts).

To find provider selection logic, visit [providerFactory.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/providerFactory.ts).

## Component Connections

The Umbra integration boundary can be found in [umbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts).
