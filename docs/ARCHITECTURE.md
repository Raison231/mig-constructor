# Architecture

## Overview

MIG Constructor is a Turborepo monorepo. The entry point is a Next.js 15 web app that renders a 3D configurator on the home page.

```
User  ->  Next.js (App Router)  ->  React Three Fiber  ->  Three.js scene
              ^                          ^
              |                          |
         Zustand state            modules-schema (Zod)
              v                          v
         pricing-engine          three-utils (MIG-Connector)
```

## Apps

### `apps/web` — the configurator

- Framework: Next.js 15 (App Router, RSC, Server Actions)
- 3D: Three.js + React Three Fiber + drei + Rapier (physics for magnetic snap)
- State: Zustand (canvas is one big mutable store)
- Styling: Tailwind CSS 4 + shadcn/ui
- i18n: next-intl, locales `ru` / `en` / `ka`
- Auth (Phase 2): Supabase Auth
- DB (Phase 2): Postgres via Supabase + Drizzle ORM
- Payments (Phase 2): Stripe + TBC Pay

## Packages

### `packages/modules-schema`

Single source of truth for module definitions. Exports the Zod `ModuleSchema`, the inferred TS `Module` type, and the `modules` array of all 16 modules.

### `packages/pricing-engine`

Pure function `calculatePrice(layout) -> PriceBreakdown`. Stateless, edge-compatible, fully testable.

### `packages/three-utils`

MIG-Connector magnetic snapping. When two modules come within 30cm, their nearest compatible connectors snap together via a Rapier joint.

## Data flow

1. User picks a module from `ModulePanel` -> `useConfigurator.addModule(id)`
2. Zustand updates -> `<Scene>` re-renders the module list
3. `<Module3D>` mounts -> (Phase 2) loads `.glb` via `useGLTF`
4. User drags -> Rapier physics + MIG-Connector snaps to nearest compatible neighbor
5. State change -> `pricing-engine` recalculates -> `<PricePanel>` updates

## Why this stack

- Next.js + RSC: SEO for catalog + blog; Server Actions for orders later
- R3F over vanilla Three.js: declarative, integrates with React tree
- Zustand over Redux: less boilerplate, perfect for 60fps canvas state
- Turborepo: ready for admin app and docs site by Phase 2
- Apache 2.0: permissive enough for community, protective enough for patents
