'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlora, type SpeciesId } from '@/stores/flora'
import { useConfigurator } from '@/stores/configurator'
import { buildForest, SPECIES, type ForestInstance } from '@/lib/flora'

const TMP_MATRIX = new THREE.Matrix4()
const TMP_QUAT = new THREE.Quaternion()
const TMP_AXIS = new THREE.Vector3(0, 1, 0)
const TMP_POS = new THREE.Vector3()
const TMP_SCALE = new THREE.Vector3()

interface ShaderRef {
  uniforms?: { uTime?: { value: number }; uWind?: { value: number }; uFlex?: { value: number } }
}

function createWindMaterial(color: string, flex: number, windStrength: number): { mat: THREE.MeshStandardMaterial; shaderRef: { current: ShaderRef | null } } {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 })
  const shaderRef = { current: null as ShaderRef | null }
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uWind = { value: windStrength }
    shader.uniforms.uFlex = { value: flex }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uTime;\nuniform float uWind;\nuniform float uFlex;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\n` +
        `float instX = instanceMatrix[3].x;\n` +
        `float instZ = instanceMatrix[3].z;\n` +
        `float h = max(position.y, 0.0);\n` +
        `float sway = sin(uTime * 1.2 + instX * 0.7 + instZ * 0.5) * uWind * uFlex * 0.06 * h;\n` +
        `transformed.x += sway;\n` +
        `transformed.z += sway * 0.6;\n`,
      )
    shaderRef.current = shader as unknown as ShaderRef
  }
  return { mat, shaderRef }
}

function SpeciesInstanced({ id, instances, windStrength }: { id: SpeciesId; instances: ForestInstance[]; windStrength: number }) {
  const def = SPECIES[id]
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const crownRef = useRef<THREE.InstancedMesh>(null)

  // Create materials once per species lifecycle so wind shaders persist.
  const { trunkMat, crownMat, crownShaderRef } = useMemo(() => {
    const trunkPair = createWindMaterial(def.trunkColor, def.flex * 0.5, windStrength)
    const crownPair = createWindMaterial(def.crownColor, def.flex, windStrength)
    return {
      trunkMat: trunkPair.mat,
      crownMat: crownPair.mat,
      crownShaderRef: crownPair.shaderRef,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Update windStrength uniform if the slider changes after compile.
  useEffect(() => {
    const s = crownShaderRef.current
    if (s?.uniforms?.uWind) s.uniforms.uWind.value = windStrength
  }, [windStrength, crownShaderRef])

  // Build geometries once.
  const trunkGeom = useMemo(() => new THREE.CylinderGeometry(def.trunkRadius * 0.85, def.trunkRadius, def.trunkHeight, 8), [def.trunkRadius, def.trunkHeight])
  const crownGeom = useMemo(() => {
    if (def.crownKind === 'cone') return new THREE.ConeGeometry(def.crownRadius, def.crownHeight, 10)
    return new THREE.IcosahedronGeometry(def.crownRadius, 0)
  }, [def.crownKind, def.crownRadius, def.crownHeight])

  // Translate trunk geometry so its base sits at y=0.
  useMemo(() => { trunkGeom.translate(0, def.trunkHeight / 2, 0) }, [trunkGeom, def.trunkHeight])
  useMemo(() => {
    const crownY = def.trunkHeight + (def.crownKind === 'cone' ? def.crownHeight / 2 : 0)
    crownGeom.translate(0, crownY, 0)
  }, [crownGeom, def.trunkHeight, def.crownHeight, def.crownKind])

  // Push instance matrices each time `instances` changes.
  useEffect(() => {
    if (!trunkRef.current || !crownRef.current) return
    for (let i = 0; i < instances.length; i++) {
      const it = instances[i]
      TMP_POS.set(it.x, 0, it.z)
      TMP_QUAT.setFromAxisAngle(TMP_AXIS, it.rotY)
      TMP_SCALE.set(it.scale, it.scale, it.scale)
      TMP_MATRIX.compose(TMP_POS, TMP_QUAT, TMP_SCALE)
      trunkRef.current.setMatrixAt(i, TMP_MATRIX)
      crownRef.current.setMatrixAt(i, TMP_MATRIX)
    }
    trunkRef.current.instanceMatrix.needsUpdate = true
    crownRef.current.instanceMatrix.needsUpdate = true
    trunkRef.current.count = instances.length
    crownRef.current.count = instances.length
  }, [instances])

  // Tick wind uniform.
  useFrame((_, dt) => {
    const s = crownShaderRef.current
    if (s?.uniforms?.uTime) s.uniforms.uTime.value += dt
  })

  if (instances.length === 0) return null
  // Allocate generously so future regenerations can grow without remount.
  const capacity = Math.max(64, instances.length + 32)
  return (
    <>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeom, trunkMat, capacity]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={crownRef}
        args={[crownGeom, crownMat, capacity]}
        castShadow
        receiveShadow
      />
    </>
  )
}

export function InstancedForest() {
  const enabled = useFlora((s) => s.enabled)
  const biome = useFlora((s) => s.biome)
  const density = useFlora((s) => s.density)
  const radius = useFlora((s) => s.radius)
  const centerX = useFlora((s) => s.centerX)
  const centerZ = useFlora((s) => s.centerZ)
  const seed = useFlora((s) => s.seed)
  const regenSalt = useFlora((s) => s.regenSalt)
  const minSpacing = useFlora((s) => s.minSpacing)
  const speciesEnabled = useFlora((s) => s.speciesEnabled)
  const windStrength = useFlora((s) => s.windStrength)
  const modules = useConfigurator((s) => s.modules)

  const forest = useMemo(() => buildForest({
    enabled, biome, density, radius, centerX, centerZ, seed, regenSalt,
    minSpacing, speciesEnabled, modules,
  }), [enabled, biome, density, radius, centerX, centerZ, seed, regenSalt, minSpacing, speciesEnabled, modules])

  if (!enabled) return null

  return (
    <group name="instanced-forest">
      {(Object.keys(forest) as SpeciesId[]).map((id) => (
        <SpeciesInstanced key={id} id={id} instances={forest[id]} windStrength={windStrength} />
      ))}
    </group>
  )
}
