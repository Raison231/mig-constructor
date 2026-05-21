// WALK COLLISIONS — capsule (player) vs AABB (modules) with sliding.
//
// Pure math, no Three.js. Used by WalkthroughCamera each frame to resolve
// the next XZ position against module footprints so the user can’t walk
// through walls.
//
// Strategy: axis-separated sweep. We test the X step first; if it collides,
// we cancel just the X step (keeping the previous X). Then we test Z. This
// gives a natural «slide along the wall» feel, no jitter, no tunneling for
// reasonable frame rates and walk speeds.

import type { ModuleFootprint } from '@/lib/flora'

export const PLAYER_RADIUS = 0.35 // meters — capsule horizontal radius

/**
 * True if the point (x,z) with radius r intersects the AABB footprint fp.
 * Uses the standard circle-vs-rect closest-point distance.
 */
export function circleHitsFootprint(x: number, z: number, r: number, fp: ModuleFootprint): boolean {
  const dx = Math.max(Math.abs(x - fp.x) - fp.halfX, 0)
  const dz = Math.max(Math.abs(z - fp.z) - fp.halfZ, 0)
  return dx * dx + dz * dz < r * r
}

export function circleHitsAny(x: number, z: number, r: number, footprints: ReadonlyArray<ModuleFootprint>): boolean {
  for (let i = 0; i < footprints.length; i++) {
    if (circleHitsFootprint(x, z, r, footprints[i])) return true
  }
  return false
}

/**
 * Resolve a wanted XZ step against module footprints.
 *
 * If the player is already inside a module (rare — e.g. a module spawned on
 * top of them), we don’t lock them in place: the function falls back to the
 * wanted position to avoid soft-locks. Builders can always exit walk mode.
 */
export function applyWalkCollisions(
  prevX: number,
  prevZ: number,
  nextX: number,
  nextZ: number,
  footprints: ReadonlyArray<ModuleFootprint>,
  radius = PLAYER_RADIUS,
): { x: number; z: number } {
  if (footprints.length === 0) return { x: nextX, z: nextZ }

  // If we’re already stuck inside something, don’t fight it.
  if (circleHitsAny(prevX, prevZ, radius, footprints)) {
    return { x: nextX, z: nextZ }
  }

  let x = nextX
  let z = prevZ
  if (circleHitsAny(x, z, radius, footprints)) {
    x = prevX // X step blocked — slide along the wall on Z
  }
  z = nextZ
  if (circleHitsAny(x, z, radius, footprints)) {
    z = prevZ // Z step blocked too
  }
  return { x, z }
}
