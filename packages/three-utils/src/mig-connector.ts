import { Vector3 } from 'three'
import type { ConnectorSide } from '@mig/modules-schema'

export type ConnectorAnchor = {
  moduleInstanceId: string
  side: ConnectorSide
  worldPosition: Vector3
  worldNormal: Vector3
  occupied: boolean
}

export type SnapPair = {
  a: ConnectorAnchor
  b: ConnectorAnchor
  distance: number
}

const SNAP_DISTANCE = 0.3 // meters
const MATE_DISTANCE = 0.05
const NORMAL_TOLERANCE = Math.cos((10 * Math.PI) / 180)

export function findSnapPairs(anchors: ConnectorAnchor[]): SnapPair[] {
  const pairs: SnapPair[] = []

  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]
    if (a.occupied) continue
    for (let j = i + 1; j < anchors.length; j++) {
      const b = anchors[j]
      if (b.occupied) continue
      if (a.moduleInstanceId === b.moduleInstanceId) continue

      const distance = a.worldPosition.distanceTo(b.worldPosition)
      if (distance > SNAP_DISTANCE) continue

      // normals must point in opposite directions for a valid mate
      const dot = a.worldNormal.dot(b.worldNormal)
      if (dot > -NORMAL_TOLERANCE) continue

      pairs.push({ a, b, distance })
    }
  }

  return pairs.sort((x, y) => x.distance - y.distance)
}

export function magneticForce(distance: number): number {
  if (distance > SNAP_DISTANCE) return 0
  // inverse-square attraction capped at 200N
  const f = 1 / Math.max(distance * distance, 0.001)
  return Math.min(f, 200)
}

export function shouldMate(distance: number): boolean {
  return distance < MATE_DISTANCE
}

export const CONSTANTS = { SNAP_DISTANCE, MATE_DISTANCE, NORMAL_TOLERANCE } as const
