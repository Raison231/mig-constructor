import { isCompatiblePair, type ConnectorAnchor } from '@mig/three-utils'
import type { ConnectorSide } from '@mig/modules-schema'

const SNAP_RADIUS = 1.6

export type SnapHit = {
  fromInstanceId: string
  fromSide: ConnectorSide
  toInstanceId: string
  toSide: ConnectorSide
  delta: [number, number, number]
}

export function findBestSnap(
  myAnchors: ConnectorAnchor[],
  otherAnchors: ConnectorAnchor[],
): SnapHit | null {
  let best: SnapHit | null = null
  let bestDist = Infinity
  for (const my of myAnchors) {
    for (const other of otherAnchors) {
      if (!isCompatiblePair(my, other)) continue
      const dx = other.worldPosition.x - my.worldPosition.x
      const dy = other.worldPosition.y - my.worldPosition.y
      const dz = other.worldPosition.z - my.worldPosition.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < SNAP_RADIUS && dist < bestDist) {
        bestDist = dist
        best = {
          fromInstanceId: my.moduleInstanceId,
          fromSide: my.side,
          toInstanceId: other.moduleInstanceId,
          toSide: other.side,
          delta: [dx, dy, dz],
        }
      }
    }
  }
  return best
}
