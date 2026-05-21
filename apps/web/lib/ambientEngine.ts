// Procedural ambient audio engine — Web Audio API only, no samples.
// Six channels (wind / birds / rustle / rain / water / drone) plus one-shot
// footstep bursts. Channels never die when muted; their gain just ramps to 0.
//
// Tesla-mode: all sound is generated from oscillators + noise + filters, so
// the resulting waveform is a real-time field signal, not a pre-baked sample.

import type { AmbientChannel } from '@/stores/audio'

type NoiseColor = 'white' | 'pink' | 'brown'

function createNoiseBuffer(ctx: AudioContext, color: NoiseColor, seconds = 4): AudioBuffer {
  const length = ctx.sampleRate * seconds
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  if (color === 'white') {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  } else if (color === 'brown') {
    let last = 0
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1
      last = (last + 0.02 * w) / 1.02
      data[i] = last * 3.5
    }
  } else {
    // pink — Paul Kellet refined filter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.96900 * b2 + w * 0.1538520
      b3 = 0.86650 * b3 + w * 0.3104856
      b4 = 0.55000 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  }
  return buffer
}

function loopNoise(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  return src
}

export interface ChannelHandle {
  gain: GainNode
  // last target so we can re-ramp smoothly
  target: number
  stop: () => void
}

export class AmbientEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  channels: Partial<Record<AmbientChannel, ChannelHandle>> = {}
  noiseWhite: AudioBuffer | null = null
  noisePink: AudioBuffer | null = null
  noiseBrown: AudioBuffer | null = null
  birdTimer: number | null = null
  rainTimer: number | null = null
  running = false

  async ensureContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor: typeof AudioContext | undefined =
        (window.AudioContext as typeof AudioContext | undefined) ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.6
      this.master.connect(this.ctx.destination)
      this.noiseWhite = createNoiseBuffer(this.ctx, 'white')
      this.noisePink = createNoiseBuffer(this.ctx, 'pink')
      this.noiseBrown = createNoiseBuffer(this.ctx, 'brown')
    }
    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume() } catch {}
    }
    return this.ctx
  }

  async start(): Promise<void> {
    if (this.running) return
    const ctx = await this.ensureContext()
    if (!ctx || !this.master) return
    this.running = true
    this.buildWind()
    this.buildRustle()
    this.buildRain()
    this.buildWater()
    this.buildDrone()
    this.buildBirdsChannel()
    this.scheduleBirds()
    this.scheduleRainDrops()
  }

  stop(): void {
    if (!this.running) return
    this.running = false
    if (this.birdTimer != null) { clearTimeout(this.birdTimer); this.birdTimer = null }
    if (this.rainTimer != null) { clearTimeout(this.rainTimer); this.rainTimer = null }
    for (const ch of Object.values(this.channels)) ch?.stop()
    this.channels = {}
  }

  setMasterVolume(v: number): void {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.linearRampToValueAtTime(v, now + 0.15)
  }

  setChannelLevel(ch: AmbientChannel, v: number): void {
    if (!this.ctx) return
    const h = this.channels[ch]
    if (!h) return
    const now = this.ctx.currentTime
    h.target = v
    h.gain.gain.cancelScheduledValues(now)
    h.gain.gain.linearRampToValueAtTime(v, now + 0.4)
  }

  // ------ channel builders ------

  private buildWind(): void {
    if (!this.ctx || !this.master || !this.noiseBrown) return
    const src = loopNoise(this.ctx, this.noiseBrown)
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 600
    lp.Q.value = 0.3
    // slow LFO modulates cutoff for breathing motion
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.08
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 250
    lfo.connect(lfoGain).connect(lp.frequency)
    const g = this.ctx.createGain()
    g.gain.value = 0
    src.connect(lp).connect(g).connect(this.master)
    src.start()
    lfo.start()
    this.channels.wind = { gain: g, target: 0, stop: () => { try { src.stop() } catch {} try { lfo.stop() } catch {} } }
  }

  private buildRustle(): void {
    if (!this.ctx || !this.master || !this.noisePink) return
    const src = loopNoise(this.ctx, this.noisePink)
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1800
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 5500
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.13
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 1200
    lfo.connect(lfoGain).connect(hp.frequency)
    const g = this.ctx.createGain()
    g.gain.value = 0
    src.connect(hp).connect(lp).connect(g).connect(this.master)
    src.start()
    lfo.start()
    this.channels.rustle = { gain: g, target: 0, stop: () => { try { src.stop() } catch {} try { lfo.stop() } catch {} } }
  }

  private buildRain(): void {
    if (!this.ctx || !this.master || !this.noiseWhite) return
    const src = loopNoise(this.ctx, this.noiseWhite)
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 3000
    bp.Q.value = 0.7
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 600
    const g = this.ctx.createGain()
    g.gain.value = 0
    src.connect(hp).connect(bp).connect(g).connect(this.master)
    src.start()
    this.channels.rain = { gain: g, target: 0, stop: () => { try { src.stop() } catch {} } }
  }

  private buildWater(): void {
    if (!this.ctx || !this.master || !this.noisePink) return
    const src = loopNoise(this.ctx, this.noisePink)
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1100
    bp.Q.value = 1.2
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.22
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 300
    lfo.connect(lfoGain).connect(bp.frequency)
    const g = this.ctx.createGain()
    g.gain.value = 0
    src.connect(bp).connect(g).connect(this.master)
    src.start()
    lfo.start()
    this.channels.water = { gain: g, target: 0, stop: () => { try { src.stop() } catch {} try { lfo.stop() } catch {} } }
  }

  private buildDrone(): void {
    if (!this.ctx || !this.master) return
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55
    const osc2 = this.ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 82.5
    const osc3 = this.ctx.createOscillator()
    osc3.type = 'triangle'
    osc3.frequency.value = 110
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 8
    lfo.connect(lfoGain).connect(osc1.frequency)
    const sum = this.ctx.createGain()
    sum.gain.value = 0.25
    osc1.connect(sum); osc2.connect(sum); osc3.connect(sum)
    const g = this.ctx.createGain()
    g.gain.value = 0
    sum.connect(g).connect(this.master)
    osc1.start(); osc2.start(); osc3.start(); lfo.start()
    this.channels.drone = {
      gain: g, target: 0,
      stop: () => { try { osc1.stop() } catch {} try { osc2.stop() } catch {} try { osc3.stop() } catch {} try { lfo.stop() } catch {} },
    }
  }

  private buildBirdsChannel(): void {
    if (!this.ctx || !this.master) return
    const g = this.ctx.createGain()
    g.gain.value = 0
    g.connect(this.master)
    this.channels.birds = { gain: g, target: 0, stop: () => { /* bird voices auto-stop */ } }
  }

  private scheduleBirds(): void {
    if (!this.running || !this.ctx) return
    const birdsHandle = this.channels.birds
    // even when muted we keep the scheduler alive (cheap), so birds resume
    // instantly when channel un-mutes.
    const interval = 600 + Math.random() * 2400
    this.birdTimer = window.setTimeout(() => {
      if (this.running && birdsHandle && birdsHandle.target > 0.02) {
        this.playBirdCall(birdsHandle.gain)
      }
      this.scheduleBirds()
    }, interval)
  }

  private playBirdCall(destination: GainNode): void {
    if (!this.ctx) return
    const baseFreq = 1800 + Math.random() * 2200
    const now = this.ctx.currentTime
    const carrier = this.ctx.createOscillator()
    const mod = this.ctx.createOscillator()
    const modGain = this.ctx.createGain()
    const env = this.ctx.createGain()
    carrier.type = 'sine'
    mod.type = 'sine'
    mod.frequency.value = baseFreq * (3 + Math.random() * 2)
    modGain.gain.value = baseFreq * (4 + Math.random() * 6)
    mod.connect(modGain).connect(carrier.frequency)
    carrier.connect(env).connect(destination)
    // chirp pitch slide
    const slideUp = Math.random() > 0.4
    carrier.frequency.setValueAtTime(baseFreq, now)
    carrier.frequency.exponentialRampToValueAtTime(
      baseFreq * (slideUp ? 1.4 + Math.random() * 0.6 : 0.6 + Math.random() * 0.3),
      now + 0.12 + Math.random() * 0.1,
    )
    const dur = 0.12 + Math.random() * 0.15
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(0.18, now + 0.015)
    env.gain.exponentialRampToValueAtTime(0.0008, now + dur)
    carrier.start(now)
    mod.start(now)
    carrier.stop(now + dur + 0.02)
    mod.stop(now + dur + 0.02)
  }

  private scheduleRainDrops(): void {
    if (!this.running || !this.ctx) return
    const rainHandle = this.channels.rain
    // Drops are accents on top of the rain bed.
    const interval = 80 + Math.random() * 220
    this.rainTimer = window.setTimeout(() => {
      if (this.running && rainHandle && rainHandle.target > 0.05) {
        this.playRainDrop(rainHandle.gain, rainHandle.target)
      }
      this.scheduleRainDrops()
    }, interval)
  }

  private playRainDrop(destination: GainNode, intensity: number): void {
    if (!this.ctx || !this.noiseWhite) return
    const now = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseWhite
    src.playbackRate.value = 1
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1500 + Math.random() * 2500
    bp.Q.value = 2.5
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(0.12 * intensity, now + 0.005)
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.06)
    src.connect(bp).connect(env).connect(destination)
    src.start(now)
    src.stop(now + 0.08)
  }

  triggerFootstep(intensity = 1): void {
    if (!this.ctx || !this.master || !this.noiseWhite) return
    const now = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseWhite
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 900 + Math.random() * 500
    bp.Q.value = 1.8
    const env = this.ctx.createGain()
    const peak = 0.22 * intensity
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(peak, now + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.13)
    src.connect(bp).connect(env).connect(this.master)
    src.start(now)
    src.stop(now + 0.16)
  }
}

let singleton: AmbientEngine | null = null
export function getEngine(): AmbientEngine {
  if (!singleton) singleton = new AmbientEngine()
  return singleton
}
