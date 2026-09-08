export interface MousePoint {
  x: number
  y: number
}

interface PathOptions {
  minSteps?: number
  maxSteps?: number
  random?: () => number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function createHumanLikePath(
  start: MousePoint,
  target: MousePoint,
  options: PathOptions = {}
): MousePoint[] {
  const random = options.random || Math.random
  const minSteps = Math.max(2, Math.floor(options.minSteps ?? 12))
  const maxSteps = Math.max(minSteps, Math.floor(options.maxSteps ?? 48))
  const dx = target.x - start.x
  const dy = target.y - start.y
  const distance = Math.hypot(dx, dy)
  const steps = clamp(Math.round(distance / 18 + random() * 8), minSteps, maxSteps)
  const normalX = distance > 0 ? -dy / distance : 0
  const normalY = distance > 0 ? dx / distance : 0
  const bend = (random() - 0.5) * Math.min(160, Math.max(30, distance * 0.35))
  const ctrl1: MousePoint = {
    x: start.x + dx * (0.25 + random() * 0.15) + normalX * bend,
    y: start.y + dy * (0.25 + random() * 0.15) + normalY * bend
  }
  const ctrl2: MousePoint = {
    x: start.x + dx * (0.65 + random() * 0.15) + normalX * bend * 0.55,
    y: start.y + dy * (0.65 + random() * 0.15) + normalY * bend * 0.55
  }

  const path: MousePoint[] = []
  for (let index = 1; index <= steps; index++) {
    const linearT = index / steps
    const t = linearT * linearT * (3 - 2 * linearT)
    const mt = 1 - t
    path.push({
      x: Math.round(mt * mt * mt * start.x + 3 * mt * mt * t * ctrl1.x + 3 * mt * t * t * ctrl2.x + t * t * t * target.x),
      y: Math.round(mt * mt * mt * start.y + 3 * mt * mt * t * ctrl1.y + 3 * mt * t * t * ctrl2.y + t * t * t * target.y)
    })
  }

  // Rounding can leave the final point one pixel away from target.
  path[path.length - 1] = { x: Math.round(target.x), y: Math.round(target.y) }
  return path
}

export function getMouseMovementDelayMs(
  progress: number,
  baseMs = 10,
  random: () => number = Math.random
): number {
  const edgePause = progress < 0.12 || progress > 0.86 ? 3 : 0
  return clamp(Math.round(baseMs + random() * 10 + edgePause), 5, 24)
}
