export type AABB = { min: [number, number, number]; max: [number, number, number] }

export function makeAABB(center: [number, number, number], size: [number, number, number]): AABB {
  return {
    min: [center[0] - size[0] / 2, center[1], center[2] - size[2] / 2],
    max: [center[0] + size[0] / 2, center[1] + size[1], center[2] + size[2] / 2],
  }
}

export function intersects(a: AABB, b: AABB): boolean {
  return (
    a.min[0] < b.max[0] && a.max[0] > b.min[0] &&
    a.min[1] < b.max[1] && a.max[1] > b.min[1] &&
    a.min[2] < b.max[2] && a.max[2] > b.min[2]
  )
}

export function inflate(box: AABB, m: number): AABB {
  return {
    min: [box.min[0] - m, box.min[1] - m, box.min[2] - m],
    max: [box.max[0] + m, box.max[1] + m, box.max[2] + m],
  }
}
