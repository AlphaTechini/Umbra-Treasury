# Frontend API Client

## Purpose

This folder contains typed frontend helpers for calling the Fastify backend in `apps/api`.

## Architectural Decisions And Tradeoffs

The API client is intentionally thin. Route pages and future stores can import these helpers instead of scattering raw `fetch` calls across Svelte components.

Environment parsing lives in [config.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/config.ts). It reads `PUBLIC_API_BASE_URL`, which is safe for browser code because it is only an API origin, not a secret.

Shared request handling lives in [http.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/http.ts). The wrapper normalizes backend `{ error }` responses into thrown `ApiClientError` instances and retries transient `GET` failures without retrying state-changing writes.

Domain-specific route helpers live in separate files so each backend surface can evolve without creating one large client module. The tradeoff is a few more small files, but the call sites stay clear and the integration remains easier to review.

## Logic Tracking

To find API base URL parsing, visit [config.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/config.ts).

To find shared HTTP request logic, visit [http.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/http.ts).

To find shared API response and payload types, visit [types.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/types.ts).

To find user API helpers, visit [users.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/users.ts).

To find DAO, owner DAO lookup, and public summary API helpers, visit [daos.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/daos.ts).

To find treasury transaction API helpers, visit [transactions.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/transactions.ts).

To find disclosure request API helpers, visit [disclosures.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/disclosures.ts).

To find report API helpers, visit [reports.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/reports.ts).

To find access log API helpers, visit [accessLogs.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/accessLogs.ts).

## Component Connections

The Fastify backend can be found in [apps/api](file:///C:/Hackathons/Umbra%20SDK/apps/api).

The backend route contracts can be found in [routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/README.md).
