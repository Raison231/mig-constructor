// Crane drop physics helpers for Rapier integration
// Provides constants and helper functions for the drop-from-sky animation

export const DROP_HEIGHT = 12 // meters above ground
export const DROP_DELAY_PER_MODULE = 350 // ms between drops in sequence
export const GRAVITY: [number, number, number] = [0, -9.81, 0]
export const RIGID_BODY_MASS = 2000 // kg per module (typical container)
export const LINEAR_DAMPING = 1.2
export const ANGULAR_DAMPING = 2.0
export const RESTITUTION = 0.05 // very low bounce — modules are heavy
export const FRICTION = 0.85

// Compute drop position above the final resting place
export function getDropOrigin(
  finalPosition: [number, number, number],
): [number, number, number] {
  return [finalPosition[0], DROP_HEIGHT, finalPosition[2]]
}

// Easing curve for crane release
export function craneEase(t: number): number {
  // ease-in: slow at top, fast at bottom (gravity natural)
  return t * t
}

// Default rigid body config for module physics
export const RIGID_BODY_CONFIG = {
  mass: RIGID_BODY_MASS,
  linearDamping: LINEAR_DAMPING,
  angularDamping: ANGULAR_DAMPING,
  restitution: RESTITUTION,
  friction: FRICTION,
} as const
