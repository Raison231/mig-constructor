# Roadmap

## 🌊 Wave 1 — Foundation (this commit) ✅

- Turborepo + pnpm workspaces
- Next.js 15 app shell with Three.js canvas
- Module catalog (16 modules) in `packages/modules-schema`
- Pricing engine stub
- MIG-Connector skeleton in `packages/three-utils`
- Docs: architecture, module catalog, connector spec

## 🌊 Wave 2 — Real 3D models

- 16 low-poly `.glb` models (Draco-compressed, <500KB each)
- `useGLTF` loading with suspense fallbacks
- Material variants (container Cor-Ten, timber CLT, hybrid)
- Lighting: HDRI environment + shadows

## 🌊 Wave 3 — MIG-Connector physics

- Rapier integration
- Magnetic snap between free connectors
- Side-aware compatibility filtering
- Visual snap indicators (glowing edges when near)

## 🌊 Wave 4 — Configurator UI

- Module library drawer (filter by category, material)
- Drag-from-library to canvas
- Multi-select, delete, duplicate
- Undo/redo stack
- Save/load layouts to URL hash

## 🌊 Wave 5 — Pricing + timeline

- Real pricing engine with delivery zones (Tbilisi/Batumi/Kutaisi/regions)
- Earthworks + assembly estimate
- Weekly Gantt timeline of construction
- PDF export of spec sheet

## 🌊 Wave 6 — i18n + share

- next-intl with ru/en/ka
- Share link generation
- Embed iframe widget for partner sites
- Social card OG images

## 🌊 Wave 7 — Backend

- Supabase auth (email + Google)
- Save layouts to user account
- Order intake form
- Admin dashboard for partner factories

## 🌊 Wave 8 — Production launch

- Stripe + TBC Pay
- VR walk-through mode
- AI assistant (suggest layouts from prompt)
- Public partner program
