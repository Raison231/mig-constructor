'use client'

import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useMeasure } from '@/stores/measure'
import type { Point3 } from '@/stores/measure'

const RAY_PLANE_NORMAL = new THREE.Vector3(0, 1, 0)

export function MeasureTool() {
  const active = useMeasure((s) => s.active)
  const points = useMeasure((s) => s.points)
  const addPoint = useMeasure((s) => s.addPoint)
  const { camera, gl } = useThree()

  useEffect(() => {
    if (!active) return
    const dom = gl.domElement
    function onClick(e: MouseEvent) {
      const rect = dom.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      const plane = new THREE.Plane(RAY_PLANE_NORMAL, 0)
      const target = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, target)) {
        addPoint([target.x, target.y, target.z] as Point3)
      }
    }
    dom.addEventListener('click', onClick)
    return () => dom.removeEventListener('click', onClick)
  }, [active, camera, gl, addPoint])

  if (!active || points.length === 0) return null

  return (
    <>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#00D26A" />
        </mesh>
      ))}
      {points.length === 2 && <DistanceLine a={points[0]} b={points[1]} />}
    </>
  )
}

function DistanceLine({ a, b }: { a: Point3; b: Point3 }) {
  const { center, len, rotY, dist, mid } = useMemo(() => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const dz = b[2] - a[2]
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const center: Point3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.05, (a[2] + b[2]) / 2]
    const rotY = Math.atan2(dx, dz)
    const mid: Point3 = [center[0], center[1] + 0.5, center[2]]
    return { center, len, rotY, dist: len, mid }
  }, [a, b])

  return (
    <>
      <mesh position={center} rotation={[0, rotY, 0]}>
        <boxGeometry args={[0.04, 0.04, len]} />
        <meshBasicMaterial color="#00D26A" />
      </mesh>
      <Html position={mid} center distanceFactor={10}>
        <div className="bg-bg/90 px-2 py-0.5 rounded text-[11px] text-accent-green font-mono whitespace-nowrap border border-accent-green/30">
          {dist.toFixed(2)} m
        </div>
      </Html>
    </>
  )
}
