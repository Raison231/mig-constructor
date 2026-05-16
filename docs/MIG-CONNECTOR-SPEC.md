# MIG-Connector specification v1.0

MIG-Connector is the universal flange that allows any MIG module to mate with any other on six sides. It is both a physical interface (a real bolted flange) and a digital interface (a constraint in the 3D scene).

## Physical specification

- Flange material: 8mm Cor-Ten steel for containers, galvanized steel plate for timber CLT
- Bolt pattern: M16 × 12 bolts on a 50mm grid around the perimeter
- Sealing: EPDM gasket strip + thermal break (10mm XPS)
- Electrical pass-through: 4 IP67 connectors (1× power 32A, 1× power 16A, 1× Cat6A, 1× fiber)
- Plumbing pass-through: 32mm fresh water (shut-off) + 50mm waste
- HVAC pass-through: 200mm insulated duct collar (optional)
- Load rating: 12 tonnes shear, 8 tonnes tension per connector

## Six sides

Every module declares supported sides: `north`, `south`, `east`, `west`, `top`, `bottom`.

- Hub-Core supports all six
- Single-purpose modules (Kitchen-Pod, Bathroom-Spa, etc.) usually support 1–3

## Digital specification

In `packages/three-utils/src/mig-connector.ts`:

1. Each `<Module3D>` exposes a `connectors: ConnectorAnchor[]` prop with world-space positions and normals of free flanges
2. On every Rapier physics tick, find pairs of free connectors within 0.3m where normals point in opposite directions (±10°)
3. The pair with smallest distance gets a magnetic force ∝ 1/d², capped at 200N
4. When d < 0.05m, replace the magnetic force with a Rapier fixed joint and mark both connectors `occupied`
5. To detach: user clicks the joint indicator and drags away with force > 500N

## Compatibility

All MIG-Connectors are mechanically identical. Material differences (steel vs. timber edge) are handled by adapter shims in the gasket layer. A container Kitchen-Pod docks directly to a timber Hub-Core.

This is the core of why "wood or container" is a material choice, not an architecture choice.
