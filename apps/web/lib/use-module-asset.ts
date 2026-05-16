'use client'

// Stub for future .glb loading.
// When real models land in /public/models/{id}.glb, swap this for useGLTF + Suspense + ErrorBoundary.
// Returning null keeps the procedural Visual component as the rendered fallback.
export function useModuleAsset(_id: string): null {
  return null
}
