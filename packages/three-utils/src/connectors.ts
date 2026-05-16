import { Vector3, Euler } from 'three'
import type { ConnectorSide } from '@mig/modules-schema'

export type ConnectorAnchor = {
  moduleInstanceId: string
  side: ConnectorSide
  worldPosition: Vector3
  worldNormal: Vector3
  occupied: boolean
}

const LOCAL_NORMALS: Record<ConnectorSide, [number, number, number]> = {
  north: [0, 0, -1],
  south: [0, 0, 1],
  east: [1, 0, 0],
  west: [-1, 0, 0],
  top: [0, 1, 0],
  bottom: [0, -1, 0],
}

function localOffset(side: ConnectorSide, w: number, h: number, d: number): [number, number, number] {
  switch (side) {
    case 'north': return [0, h / 2, -d / 2]
    case 'south': return [0, h / 2, d / 2]
    case 'east': return [w / 2, h / 2, 0]
    case 'west': return [-w / 2, h / 2, 0]
    case 'top': return [0, h, 0]
    case 'bottom': return [0, 0, 0]
  }
}

export function buildAnchors(args: {
  moduleInstanceId: string
  sides: ConnectorSide[]
  position: [number, number, number]
  rotationY: number
  w: number
  h: number
  d: number
}): ConnectorAnchor[] {
  const { moduleInstanceId, sides, position, rotationY, w, h, d } = args
  const euler = new Euler(0, rotationY, 0)
  return sides.map((side) => {
    const local = localOffset(side, w, h, d)
    const worldPos = new Vector3(local[0], local[1], local[2]).applyEuler(euler).add(new Vector3(position[0], position[1], position[2]))
    const nrmLocal = LOCAL_NORMALS[side]
    const worldNrm = new Vector3(nrmLocal[0], nrmLocal[1], nrmLocal[2]).applyEuler(euler)
    return { moduleInstanceId, side, worldPosition: worldPos, worldNormal: worldNrm, occupied: false }
  })
}

export function isCompatiblePair(a: ConnectorAnchor, b: ConnectorAnchor): boolean {
  if (a.moduleInstanceId === b.moduleInstanceId) return false
  if (a.occupied || b.occupied) return false
  const dot = a.worldNormal.clone().normalize().dot(b.worldNormal.clone().normalize())
  return dot < -0.85
}
