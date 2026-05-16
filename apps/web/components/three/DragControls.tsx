'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3, Plane, Raycaster, Vector2 } from 'three'
import { buildAnchors } from '@mig/three-utils'
import { modules as MODULES } from '@mig/modules-schema'
import { useConfigurator } from '@/stores/configurator'
import { moduleDims } from './modules/shared/dimensions'
import { findBestSnap } from '@/lib/snap'
import { makeAABB, intersects, inflate } from '@/lib/collision'

export function DragControls() {
  const { camera, gl } = useThree()
  const dragging = useConfigurator((s) => s.draggingId)
  const setDragging = useConfigurator((s) => s.setDragging)
  const moveModule = useConfigurator((s) => s.moveModule)
  const commitMove = useConfigurator((s) => s.commitMove)
  const setSnapTarget = useConfigurator((s) => s.setSnapTarget)
  const modulesRef = useRef(useConfigurator.getState().modules)

  useEffect(() => useConfigurator.subscribe((s) => { modulesRef.current = s.modules }), [])

  const raycaster = useMemo(() => new Raycaster(), [])
  const ndc = useMemo(() => new Vector2(), [])
  const groundPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])
  const movedRef = useRef(false)

  useEffect(() => {
    if (!dragging) return
    movedRef.current = false
    const canvas = gl.domElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const hit = new Vector3()
      if (!raycaster.ray.intersectPlane(groundPlane, hit)) return
      movedRef.current = true

      const all = modulesRef.current
      const me = all.find((m) => m.instanceId === dragging)
      if (!me) return
      const meDef = MODULES.find((d) => d.id === me.moduleId)
      if (!meDef) return
      const meDims = moduleDims(meDef.area_m2, me.material)

      let newPos: [number, number, number] = [hit.x, 0, hit.z]

      const myAnchors = buildAnchors({
        moduleInstanceId: me.instanceId,
        sides: meDef.connectors,
        position: newPos,
        rotationY: me.rotationY,
        w: meDims.w, h: meDims.h, d: meDims.d,
      })

      const otherAnchors = all.flatMap((o) => {
        if (o.instanceId === dragging) return []
        const oDef = MODULES.find((d) => d.id === o.moduleId)
        if (!oDef) return []
        const oDims = moduleDims(oDef.area_m2, o.material)
        return buildAnchors({
          moduleInstanceId: o.instanceId,
          sides: oDef.connectors,
          position: o.position,
          rotationY: o.rotationY,
          w: oDims.w, h: oDims.h, d: oDims.d,
        })
      })

      const snap = findBestSnap(myAnchors, otherAnchors)
      if (snap) {
        newPos = [newPos[0] + snap.delta[0], newPos[1] + snap.delta[1], newPos[2] + snap.delta[2]]
        setSnapTarget({ from: snap.fromInstanceId, to: snap.toInstanceId })
      } else {
        setSnapTarget(null)
      }

      const myBox = makeAABB(newPos, [meDims.w, meDims.h, meDims.d])
      let blocked = false
      for (const o of all) {
        if (o.instanceId === dragging) continue
        const oDef = MODULES.find((d) => d.id === o.moduleId)
        if (!oDef) continue
        const oDims = moduleDims(oDef.area_m2, o.material)
        const oBox = makeAABB(o.position, [oDims.w, oDims.h, oDims.d])
        if (intersects(inflate(myBox, -0.08), inflate(oBox, -0.08))) { blocked = true; break }
      }
      if (!blocked) moveModule(dragging, newPos)
    }
    const onUp = () => {
      setDragging(null)
      if (movedRef.current) commitMove()
      else setSnapTarget(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, camera, gl, ndc, raycaster, groundPlane, moveModule, commitMove, setDragging, setSnapTarget])

  return null
}
