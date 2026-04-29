# Web Frontend

## Purpose

This workspace contains the SvelteKit frontend for Umbra Treasury Disclosure.

## Architectural Decisions And Tradeoffs

The frontend is imported into the monorepo as [apps/web](file:///C:/Hackathons/Umbra%20SDK/apps/web) so the backend and web client can share one workspace, one lockfile, and one deployment story.

SvelteKit uses [adapter-vercel](file:///C:/Hackathons/Umbra%20SDK/apps/web/svelte.config.js) to match the project deployment target. The tradeoff is that local preview follows SvelteKit's Vercel adapter output rather than the previous generic adapter-auto behavior.

Gemini insight generation stays in a server route and reads `GEMINI_API_KEY` through SvelteKit private environment access. The key is never inlined through Vite client defines.

The imported npm lockfile was removed because this repository uses pnpm. Dependency versions are pinned in [package.json](file:///C:/Hackathons/Umbra%20SDK/apps/web/package.json) and resolved in the root pnpm lockfile.

## Logic Tracking

To find SvelteKit configuration, visit [svelte.config.js](file:///C:/Hackathons/Umbra%20SDK/apps/web/svelte.config.js).

To find Vite configuration, visit [vite.config.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/vite.config.ts).

To find frontend environment examples, visit [.env.example](file:///C:/Hackathons/Umbra%20SDK/apps/web/.env.example).

To find application routes, visit [src/routes/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/README.md).

To find shared frontend helpers and components, visit [src/lib/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/lib/README.md).

To find Gemini insight generation, visit [src/routes/api/ai/insights/+server.ts](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/routes/api/ai/insights/+server.ts).

## Component Connections

The frontend package can be found in [package.json](file:///C:/Hackathons/Umbra%20SDK/apps/web/package.json).

The Svelte app shell can be found in [src/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/web/src/README.md).

The API backend can be found in [../api/README.md](file:///C:/Hackathons/Umbra%20SDK/apps/api/README.md).

## Local Commands

```powershell
pnpm install
pnpm dev:web
pnpm check:web
pnpm build:web
```
