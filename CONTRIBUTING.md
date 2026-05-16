# Contributing to MIG Constructor

Welcome. This project is open-core — modules, fixes, translations, and ideas welcome.

## Setup

```bash
corepack enable
pnpm install
pnpm dev
```

## Adding a new module

1. Define it in `packages/modules-schema/src/modules.json` per the Zod schema in `schema.ts`
2. Create a 3D model in Blender, export as `.glb` with Draco, place in `apps/web/public/models/{id}.glb`
3. Add a thumbnail in `apps/web/public/modules/{id}.jpg` (800x600, <100KB)
4. Document it in `docs/MODULES.md`
5. Open a PR

## Translations

Language files live in `packages/i18n/src/{locale}.json`. Currently: `ru`, `en`, `ka`.

## Pull request checklist

- `pnpm typecheck` passes
- `pnpm lint` passes
- `pnpm build` passes
- Screenshot for any UI change
- Updated docs if behavior changed

## License of contributions

Code: Apache 2.0. 3D models: CC-BY-NC 4.0.
