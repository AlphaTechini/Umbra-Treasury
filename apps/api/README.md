# API Backend

## Purpose

This workspace contains the Fastify backend for Umbra Treasury Disclosure.

## Architectural Decisions And Tradeoffs

The API is built as a modular Fastify service with separate route, service, repository, database, config, and provider folders. This keeps HTTP concerns, business workflow, persistence, and Umbra integration boundaries independent.

Drizzle ORM is used with PostgreSQL through `drizzle-orm/node-postgres`. This keeps the backend close to SQL and avoids generated client code. The tradeoff is that the application owns ID generation and timestamp updates explicitly.

Umbra integration starts behind a provider boundary. [MockUmbraProvider](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/mockUmbraProvider.ts) supports the first backend demo without pretending mock output is verified protocol disclosure. [UmbraProvider](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts) is the replacement point for real SDK calls.

Owner-sensitive API actions require a signed wallet authorization payload. This keeps the MVP wallet-based while preventing callers from approving disclosures or generating reports by only submitting an owner wallet address.

Umbra compliance report ingestion records frontend-issued grant references as unverified protocol evidence. The backend does not store viewing keys and does not let clients self-declare verified Umbra compliance.

## Logic Tracking

To find the Fastify app wiring, visit [app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts).

To find client error response handling, visit [app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts).

To find the server startup logic, visit [server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/server.ts).

To find environment parsing, visit [env.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/env.ts).

To find health and readiness routes, visit [health.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/health.ts).

To find Drizzle connection logic, visit [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

To find the Drizzle schema, visit [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).

To find DAO workflow logic, visit [daoService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/daoService.ts).

To find public summary logic, visit [summaryService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/summaryService.ts).

To find disclosure workflow logic, visit [disclosureService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/disclosureService.ts).

To find report generation logic, visit [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).

To find Umbra compliance report ingestion logic, visit [reportService.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/reportService.ts).

To find Umbra provider contracts, visit [umbraProvider.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/umbraProvider.ts).

To find wallet signature verification logic, visit [walletAuthorization.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/walletAuthorization.ts).

## Component Connections

The HTTP API can be found in [routes](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes).

The backend service layer can be found in [services](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services).

The database repositories can be found in [repositories](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories).

The Umbra integration boundary can be found in [providers](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers).

The backend Dockerfile can be found in [Dockerfile](file:///C:/Hackathons/Umbra%20SDK/apps/api/Dockerfile).

The Docker build ignore rules can be found in [Dockerfile.dockerignore](file:///C:/Hackathons/Umbra%20SDK/apps/api/Dockerfile.dockerignore).

The readiness connection check can be found in [client.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/client.ts).

## Wallet Authorization

Sensitive write payloads include `walletAuthorization`:

```json
{
  "walletAddress": "base58-solana-address",
  "message": "{\"app\":\"umbra-treasury-disclosure\",\"action\":\"report:umbra:create\",\"walletAddress\":\"base58-solana-address\",\"requestId\":\"disclosure-request-id\",\"issuedAt\":\"2026-04-29T12:00:00.000Z\",\"expiresAt\":\"2026-04-29T12:10:00.000Z\"}",
  "signature": "base64-ed25519-signature"
}
```

The message must be signed exactly as sent. Supported actions are `treasury_transaction:create`, `disclosure:review`, `report:mock:create`, and `report:umbra:create`.

## Docker Build

Build from the repository root so the workspace and backend source are available:

```powershell
docker build -f apps/api/Dockerfile -t umbra-treasury-api .
```
