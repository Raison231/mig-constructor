# MIG Constructor

Open-source 3D web configurator for modular cabins, container houses, and hybrid LEGO-style buildings. Pick modules, snap them together, see real-time price and weekly delivery plan. Georgia-first, world-ready.

[![CI](https://github.com/Raison231/mig-constructor/actions/workflows/ci.yml/badge.svg)](https://github.com/Raison231/mig-constructor/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

## What this is

- 16 unified modules. Each available in 3 materials: container (steel), timber (CLT/SIP), hybrid.
- One universal connector (the **MIG-Connector**) lets any module dock to any other on 6 sides.
- 3D configurator runs in the browser. No login to play.
- Real-time pricing — container, timber, or hybrid — Georgia delivery included.
- Open-core: configurator + module schema MIT/Apache, premium modules and ordering UI are commercial later.

## Quick start

```bash
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:3000

## Monorepo layout

```
mig-constructor/
├── apps/
│   └── web/                    # Next.js 15 + React Three Fiber configurator
├── packages/
│   ├── modules-schema/         # Zod schema + 16 modules in JSON
│   ├── pricing-engine/         # Pure pricing calculator
│   └── three-utils/            # MIG-Connector magnetic snap logic
└── docs/
    ├── ARCHITECTURE.md
    ├── MODULES.md
    ├── MIG-CONNECTOR-SPEC.md
    └── ROADMAP.md
```

## Stack

- **Web:** Next.js 15, React 19, TypeScript, Tailwind 4
- **3D:** Three.js r170, @react-three/fiber, @react-three/drei, @react-three/rapier
- **State:** Zustand 5
- **Tooling:** Turborepo 2, pnpm 9, Biome

## Status

🌊 Wave 1: foundation (this commit). See [`docs/ROADMAP.md`](docs/ROADMAP.md) for upcoming waves.

## License

- **Code:** Apache 2.0 (see [LICENSE](LICENSE))
- **3D models in `assets/models/`:** CC-BY-NC 4.0

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New modules, translations, and bug fixes welcome.
