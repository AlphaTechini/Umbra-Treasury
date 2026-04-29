# Utilities

## Purpose

This folder contains shared backend helper logic.

## Architectural Decisions And Tradeoffs

Only cross-cutting helpers live here. Feature-specific logic stays in services or repositories so this folder does not become a dumping ground.

The tradeoff is that adding a helper requires checking whether it is truly shared, but it keeps feature ownership clearer.

## Logic Tracking

To find API error helpers, visit [apiError.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/apiError.ts).

To find Zod request parsing helpers, visit [validate.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/validate.ts).

To find wallet action signature verification, visit [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/walletAuthorization.ts).

## Component Connections

The API error system can be found in [apiError.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/apiError.ts).

The wallet authorization system can be found in [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/walletAuthorization.ts).
