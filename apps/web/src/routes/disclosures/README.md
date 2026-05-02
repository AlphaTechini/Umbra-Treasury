# Disclosures Route

## Purpose

This folder contains disclosure request listing, review, and request-submission routes.

## Architectural Decisions And Tradeoffs

The listing page in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/+page.svelte) reads disclosure requests from the backend and signs owner review/report actions in the browser. The tradeoff is that sensitive actions require fresh wallet prompts, but backend writes cannot be authorized by wallet address alone.

The request page lives in [request/+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/request/+page.svelte). It maps UI options to backend enums before submitting the request.

## Logic Tracking

To find disclosure list and review logic, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/+page.svelte).

To find disclosure request submission logic, visit [request/+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/request/+page.svelte).

To find disclosure API helpers, visit [disclosures.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/disclosures.ts).

## Component Connections

The browser wallet authorization system can be found in [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/session/walletAuthorization.ts).

The backend disclosure workflow can be found in [disclosureService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/disclosureService.ts).
