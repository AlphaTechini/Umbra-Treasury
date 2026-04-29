# Project Structure

## Current Files

```txt
.
|-- .agents/
|   |-- GUIDE.md
|   `-- README.md
|-- apps/
|   |-- README.md
|   `-- api/
|       |-- Dockerfile
|       |-- Dockerfile.dockerignore
|       |-- README.md
|       |-- package.json
|       |-- tsconfig.json
|       `-- src/
|           |-- README.md
|           |-- app.ts
|           |-- server.ts
|           |-- config/
|           |-- db/
|           |-- providers/
|           |-- repositories/
|           |-- routes/
|           |-- services/
|           `-- utils/
|-- migrations/
|   |-- README.md
|   |-- 0000_bent_xorn.sql
|   `-- meta/
|-- .env.example
|-- .gitignore
|-- .npmrc
|-- drizzle.config.ts
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
|-- README.md
|-- Resources.md
|-- Schema.md
|-- tsconfig.base.json
|-- Umbra.md
|-- Userflow.md
`-- structure.md
```

## Logic Map

To find the product overview, visit [README.md](./README.md).

To find the data model and persistence rules, visit [Schema.md](./Schema.md).

To find the Umbra integration strategy, visit [Umbra.md](./Umbra.md).

To find the user and disclosure flows, visit [Userflow.md](./Userflow.md).

To find external implementation resources, visit [Resources.md](./Resources.md).

To find the implemented Drizzle schema, visit [apps/api/src/db/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/README.md) and [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts).

To find the Drizzle CLI configuration, visit [drizzle.config.ts](./drizzle.config.ts).

To find SQL migrations, visit [migrations/README.md](file:///C:/Hackathons/Umbra%20SDK/migrations/README.md).

To find the backend API implementation, visit [apps/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/README.md) and [apps/api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).

To find backend route handlers, visit [apps/api/src/routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/README.md).

To find backend workflow logic, visit [apps/api/src/services/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/README.md).

To find backend database queries, visit [apps/api/src/repositories/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/README.md).

To find the Umbra provider boundary, visit [apps/api/src/providers/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/README.md).

To find persistent implementation decisions for future agents, visit [.agents/README.md](file:///C:/Hackathons/Umbra%20SDK/.agents/README.md) and [.agents/GUIDE.md](file:///C:/Hackathons/Umbra%20SDK/.agents/GUIDE.md).

## High-Level Mapping

The privacy model can be found in [Umbra.md](./Umbra.md) and [Schema.md](./Schema.md).

The disclosure request lifecycle can be found in [Userflow.md](./Userflow.md) and [Schema.md](./Schema.md).

The report source and verification rules can be found in [Schema.md](./Schema.md).

The database implementation can be found in [schema.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/schema.ts) and [0000_bent_xorn.sql](file:///C:/Hackathons/Umbra%20SDK/migrations/0000_bent_xorn.sql).

The backend API shell can be found in [apps/api/src/app.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/app.ts) and [apps/api/src/server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/server.ts).

The first backend vertical slice can be found across [routes](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes), [services](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services), and [repositories](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories).

The Umbra resource list can be found in [Resources.md](./Resources.md).

## Folder READMEs

The `.agents` folder README can be found in [.agents/README.md](file:///C:/Hackathons/Umbra%20SDK/.agents/README.md).

The `apps` folder README can be found in [apps/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/README.md).

The `apps/api` folder README can be found in [apps/api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).

The `apps/api/src` folder README can be found in [apps/api/src/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/README.md).

The `apps/api/src/config` folder README can be found in [apps/api/src/config/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/config/README.md).

The `apps/api/src/db` folder README can be found in [apps/api/src/db/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/db/README.md).

The `apps/api/src/providers` folder README can be found in [apps/api/src/providers/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/providers/README.md).

The `apps/api/src/repositories` folder README can be found in [apps/api/src/repositories/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/repositories/README.md).

The `apps/api/src/routes` folder README can be found in [apps/api/src/routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/routes/README.md).

The `apps/api/src/services` folder README can be found in [apps/api/src/services/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/services/README.md).

The `apps/api/src/utils` folder README can be found in [apps/api/src/utils/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/src/utils/README.md).

The `migrations` folder README can be found in [migrations/README.md](file:///C:/Hackathons/Umbra%20SDK/migrations/README.md).

The `migrations/meta` folder is Drizzle Kit metadata. It intentionally does not contain a README because Drizzle Kit parses files in that folder as JSON.
