export function downloadSceneScreenshot() {
  if (typeof document === 'undefined') return
  const canvas = document.querySelector('canvas')
  if (!canvas) return
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `mig-constructor-${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
