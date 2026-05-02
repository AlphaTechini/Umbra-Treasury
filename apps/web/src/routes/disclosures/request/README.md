# Disclosure Request Route

## Purpose

This folder contains the SvelteKit page for submitting scoped disclosure requests.

## Architectural Decisions And Tradeoffs

The page in [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/request/+page.svelte) submits directly to the Fastify disclosure request endpoint through the typed frontend API helper. The tradeoff is a compact route-local form today, with shared form components deferred until repeated disclosure forms appear.

The route maps user-facing values to backend enums before submission so backend validation receives stable values like `community_review`, `single_transaction`, and `date_range`.

## Logic Tracking

To find disclosure request form submission, visit [+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/request/+page.svelte).

To find disclosure request API helpers, visit [disclosures.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/api/disclosures.ts).

## Component Connections

The disclosure list route can be found in [../+page.svelte](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/disclosures/+page.svelte).

The backend disclosure route contract can be found in [disclosureRequests.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/disclosureRequests.ts).
